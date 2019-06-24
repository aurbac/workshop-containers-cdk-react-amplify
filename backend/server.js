var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var app = express()

//console.log(process.env)

var AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION
var DYNAMODB_MESSAGES_TABLE = process.env.DYNAMODB_MESSAGES_TABLE
var APP_ID = process.env.APP_ID

app.use(cors())
app.use(bodyParser.json())

app.get('/messages/:token?', (req,res) => {
    
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
    var params = {
      Limit:3,
      ScanIndexForward: false,
      ExpressionAttributeValues: {
        ":app_id" : { S : APP_ID },
        ":created_at_start" : { N : '0' },
        ":created_at_end" : { N : Math.floor(Date.now() / 1000).toString() }
      },
      KeyConditionExpression: "#app_id = :app_id and #created_at BETWEEN :created_at_start AND :created_at_end",
      ExpressionAttributeNames: { "#app_id" : "app_id", "#created_at" : "created_at"  },
      TableName: DYNAMODB_MESSAGES_TABLE
    };
    
    var token = req.params.token;
    if (token) {
        console.log(token);
        var buff_token = new Buffer(token, 'base64');
        params.ExclusiveStartKey = JSON.parse(buff_token.toString());
    }
    
    console.log(params);
    
    ddb.query(params, function(err, data) {
      if (err) {
        
        console.log("Error", err);
        res.status(500).send("Messages were not found.");
        
      } else {
        
        console.log(data);
        
        var base64_last_evaluated_key = "";
        if (data.LastEvaluatedKey){
          var last_evaluated_key = JSON.stringify(data.LastEvaluatedKey);
          var buff = new Buffer(last_evaluated_key);  
          base64_last_evaluated_key = buff.toString('base64');
        }
        
        var messages = {
          messages : [],
          token : base64_last_evaluated_key
        };
        
        data.Items.forEach(function(element, index, array) {
          messages.messages.push({ "created_at" : element.created_at.N , "message" : element.message.S });
        });
        
      }
    });
})

app.get('/', (req,res) => {
    res.status(200).send(AWS_DEFAULT_REGION);
})

app.listen(3000);