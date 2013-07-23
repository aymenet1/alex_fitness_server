// reference the http module so we can create a webserver
var http = require("http");
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;  
var restify = require('restify');    

var server = restify.createServer();
server.get('/latest/schedule/:datetime/:clubid', getLatestSchedules);
server.get('/latest/news/:datetime/:clubid', getLatestNews);
//server.head('/hello/:name', respond);

server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});

// http://alexfitness.volkoale.c9.io/latest/schedule/2013-04-17T16%3A35%3A43.640Z/cl3
function getLatestSchedules(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
MongoClient.connect('mongodb://root:root@ds061757.mongolab.com:61757/mongoalex', function(err, db) {

  var collection = db.collection('tSchedule').find({fClubId :req.params.clubid ,createdAt:{$gt :req.params.datetime }}).sort( { createdAt: 1 } )
      .toArray(function(err, docs) {
       console.log("club_id : "+req.params.clubid);
       console.dir(docs);
        res.send(docs);
    });  
});        
 
}


// http://alexfitness.volkoale.c9.io/latest/news/2013-04-17T16%3A35%3A43.640Z/cl3
function getLatestNews(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
MongoClient.connect('mongodb://root:root@ds061757.mongolab.com:61757/mongoalex', function(err, db) {
    console.log(req.params.datetime);
  var collection = db.collection('tNews').find({createdAt:{$gt :req.params.datetime }}).sort( { createdAt: 1 } )
      .toArray(function(err, docs) {
        //console.dir(docs);
        console.log("club_id : "+req.params.clubid);
        var filtred_array=[];
        if(docs.length>0){  
            for(i=0;i<docs.length;i++){
                if(docs[i].fClubID.indexOf(req.params.clubid)>=0){
                    filtred_array.push(docs[i]);  
                }
            } 
            
            
        }
        console.log("filtered_array ",filtred_array);
        res.send(filtred_array);
    });  
});        
 
}



