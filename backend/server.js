var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')

var app = express()

console.log(process.env)

var AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION

var messages = [
    {message: 'This is a message 1.'},
    {message: 'This is a message 2.'}
]

app.use(cors())
app.use(bodyParser.json())

app.get('/messages', (req,res) => {
    res.status(200).send(messages);
})

app.get('/', (req,res) => {
    res.status(200).send(AWS_DEFAULT_REGION);
})

app.listen(3000)