var text = 'test';
var mongodb = null;
/**
 * Inserting a Document
 *
 */
var insertDocuments = function(name, db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insert({
        a: 1, b: name
    }, function(err, result) {
        assert.equal(err, null);
        // assert.equal(3, result.result.n);
        // assert.equal(3, result.ops.length);
        // console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
}

/**
 * Updating all 
 *
 */
var updateDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.bulkWrite([{ updateMany: { filter: {a:8}, update: {$set: {a:11}}, upsert:true } }]
  , {ordered:true, w:1}, function(err, result) {
	    assert.equal(err, null);
	    console.log("Updated the document");
	    callback(result);
  });
}

/**
 * Updating a document 
 *
 */
var updateDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.bulkWrite([{ updateMany: { filter: {a:8}, update: {$set: {a:11}}, upsert:true } }]
  , {ordered:true, w:1}, function(err, result) {
	    assert.equal(err, null);
	    console.log("Updated the document");
	    callback(result);
  });
}

function clientInsert(name) {
	// MongoClient.connect(url, function(err, db) {
    // assert.equal(null, err);
    // console.log("Connected correctly to server");
    // insertDocuments(db, function() {
    //   updateDocument(db, function() {
    //     // removeDocument(db, function() {
    //     //   findDocuments(db, function() {
    //     //     db.close();
    //     //   });
    //     // });
    //   	db.close();
    //   });
    // });
    insertDocuments(name, mongodb, function() {
        // db.close();
    });
// });
}

/**
 * Remove a document
 *
 */
var removeDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.remove({
        a: 3
    }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
}
/**
 * Find All Documents
 *
 */
var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    collection.findOne({a:5}, function(err, item) {
          assert.equal(err, null);
          // assert.equal(null, item);
          console.log(item);
          // Simple findAndModify command performing an upsert and returning the new document
          // executing the command safely
          text = item["b"];
          console.log("text: " + text);
        });

     // print all
     collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        for (var i = 0; i < docs.length; i++) {
        	console.log(docs[i])
        };
        // console.log("Found the following records");
        // console.dir(docs)
        // callback(docs);
    });
    // Find some documents
    // collection.find({a:5}).toArray(function(err, docs) {
    //     assert.equal(err, null);
    //     // assert.equal(2, docs.length);
    //     console.log("Found the following records");
    //     console.dir(docs)
    //     callback(docs);
    // });
}

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    // insertDocuments(db, function() {
    //   updateDocument(db, function() {
    //     // removeDocument(db, function() {
    //     //   findDocuments(db, function() {
    //     //     db.close();
    //     //   });
    //     // });
    //   	db.close();
    //   });
    // });
    // findDocuments(db, function() {
    //     // removeDocument(db, function() {
    //     //   findDocuments(db, function() {
    //     //     db.close();
    //     //   });
    //     // });
    //     db.close();
    // });
	mongodb = db;
});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");   
    res.header("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, OPTIONS");  
    res.header("Access-Control-Allow-Headers","X-Requested-With, content-type");  
    res.header("Access-Control-Allow-Credentials", true);  
    next();  
});  

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.htm');
});

io.on('connection', function(socket){
  console.log('a user connected');
    
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);

    clientInsert(msg)
    io.emit('chat message', msg);
  });

});

var server = http.listen(2015, function() {
  console.log('start at port: 2015');
});

// http.close(function(){
// 	if (mongodb != null)
// 		mongodb.close();
// });