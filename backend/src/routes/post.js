const express = require('express');
const router = new express.Router();
/*
  Using busboy to parse incoming form data

  https://github.com/mscdex/busboy
*/
const inspect = require('util').inspect;
const Busboy = require('busboy');
/*
  -> Using nodejs temp folder to store file temporarily
  -> Upload img to firebase storage from temp folder
*/
const path = require('path');
const os = require('os'); // allows access the temp folder
const fs = require('fs'); // allows to write file to temp folder
const { v4 } = require('uuid');
const webpush = require('web-push');
require('dotenv').config();

/*
  Web-push config

  https://github.com/web-push-libs/web-push
*/

webpush.setVapidDetails(
  'mailto:test@test.com',
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY
);

/*
  Cloud firestore connection

  https://firebase.google.com/docs/firestore/quickstart#node.js
*/
const admin = require('firebase-admin');

/*
  Firebase connection
  
  App cog -> service accounts -> generate new private key
*/
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'quasar-pwa-960cc.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

router.get('/posts', async (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*');
  
  const posts = [];

  const snapshot = await db.collection('posts').orderBy('timestamp', 'desc').get();

  snapshot.forEach((doc) => {
    // console.log(doc.id, '=>', doc.data());
    posts.push(doc.data());
  });

  res.send(posts);
});

router.post('/posts', async (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*');

  const uuid = v4();

  var busboy = new Busboy({ headers: req.headers });

  const fields = {};
  let fileData = {};

  // on file hook trigerred on every FILE sent to this endpoint
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    
    const filepath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filepath));
    fileData = { filepath, mimetype };
  });

  // on file hook trigerred on every FIELD sent to this endpoint
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    fields[fieldname] = val;
  });

  // fires when busboy finished parsing form
  busboy.on('finish', async function() {
    // upload image first then get url and save to db
    bucket.upload(
      fileData.filepath,
      {
        uploadType: 'media',
        metadata: {
          metadata: {
            contentType: fileData.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      }, (err, uploadedFile) => {
        if(!err) {
          uploadDocument(uploadedFile);
        }
      }
    );

    const uploadDocument = async (uploadedFile) => {
      // save form data to firebase firestore
      const docRef = db.collection('posts').doc(fields.id);
  
      try {
        const doc = {
          id: fields.id,
          caption: fields.caption,
          location: fields.location,
          timestamp: parseInt(fields.timestamp),
          imgUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
        };
        await docRef.set(doc);

        sendPushNotif();
        res.status(200).send(doc);
      }catch(err) {
        console.log(err);
      }
    }

    const sendPushNotif = async () => {
      const subscriptions = [];

      const snapshot = await db.collection('subscriptions').get();

      snapshot.forEach((doc) => {
        subscriptions.push(doc.data());
      });

      subscriptions.forEach(subscription => {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.keys.auth,
            p256dh: subscription.keys.p256dh
          }
        };
        
        // can also send a object, just make to parse data in SW
        // webpush.sendNotification(pushSubscription, JSON.stringify({
        //   title: 'New post!',
        //   body: 'New post added, check it out!'
        // }));

        webpush.sendNotification(pushSubscription, 'New post added, check it out!');
      })
    }
  });

  req.pipe(busboy);
});

router.post('/subscription', async (req, res) => {
  // res.set('Access-Control-Allow-Origin', '*');

  try {
    db.collection('subscriptions').add(req.body);

    res.status(200).send({
      message: 'subscription added'
    });
  }catch(err) {
    console.log(err);
  }
});

module.exports = router;