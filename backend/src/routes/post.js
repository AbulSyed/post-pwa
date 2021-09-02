const express = require('express');
const router = new express.Router();
/*
  Using busboy to parse incoming form data

  https://github.com/mscdex/busboy
*/
const inspect = require('util').inspect;
const Busboy = require('busboy');

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
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

router.get('/posts', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  const posts = [];

  const snapshot = await db.collection('posts').orderBy('timestamp', 'desc').get();

  snapshot.forEach((doc) => {
    // console.log(doc.id, '=>', doc.data());
    posts.push(doc.data());
  });

  res.send(posts);
});

router.post('/posts', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  var busboy = new Busboy({ headers: req.headers });

  const fields = {};

  // on file hook trigerred on every FILE sent to this endpoint
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    // fires when busboy recieves data of formdata
    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    // fires when busboy finished grabbing all formdata
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
  });

  // on file hook trigerred on every FIELD sent to this endpoint
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    fields[fieldname] = val;
  });

  // fires when busboy finished parsing form
  busboy.on('finish', async function() {
    // save form data to firebase firestore
    const docRef = db.collection('posts').doc(fields.id);

    await docRef.set({
      id: fields.id,
      caption: fields.caption,
      location: fields.location,
      timestamp: parseInt(fields.timestamp),
      imgUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/spiderman-1604616315.jpg?crop=0.5xw:1xh;center,top&resize=640:*'
    });

    console.log('Done parsing form!');
    res.send('Done parsing form');
  });

  req.pipe(busboy);
});

module.exports = router;