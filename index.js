const express = require('express')
const expressRest = require('express-rest')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const rest = expressRest(app);
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'extserver';

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
    findDocuments(db, function() {
      client.close();
    });
  });
});


rest.get('/api/settings', function(req, rest) {
    rest.ok(settings);
});

rest.get('/api/food', function(req, rest) {
    rest.ok(records);
});

rest.get('/api/food/:id', function(req, rest) {
    var record = records[req.params.id];
    if (record) rest.ok(record);
    else rest.notFound();
});

rest.put('/api/food/:id', function(req, rest) {
    records[req.params.id] = req.body;
    return rest.accepted('/api/food/' + encodeURI(req.params.id));
});

rest.post('/api/food', function(req, rest) {
    records.push(req.body);
    rest.created('/api/food/' + (records.length - 1));
});

rest.delete('/api/food/:id', function(req, rest) {
    delete records[req.params.id];
    rest.gone();
})

 
app.listen(process.env.PORT || 8090)
