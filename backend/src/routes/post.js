const express = require('express');
const router = new express.Router();
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
    console.log(doc.id, '=>', doc.data());
    posts.push(doc.data());
  });

  res.send(posts);
});

module.exports = router;