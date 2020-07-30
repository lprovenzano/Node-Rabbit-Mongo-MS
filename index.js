const express = require('express')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient
const amqp = require('amqplib/callback_api');

// Connection URL
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/dbcontainer';
const rabbitUrl = process.env.RABBIT_MQ_URL || 'amqp://localhost:5672';

app.options('/mongo', (req, res) => {
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
    if (err){
      res.status(500).send(`Connection to MongoDB lost ${err} | env: ${mongoUrl}`);
    }
    res.status(200).send(`OK! Connected: ${mongoUrl}`);
    db.close();
  });
});

app.options('/rabbitmq', (req, res) => {
  amqp.connect(rabbitUrl, function(err, connection) {
    if (err) {
      res.status(500).send(`Connection to AMQP lost ${err} | env: ${url}`);
    }

    connection.createChannel((err, channel) => {
      if (err) {
        res.status(500).send(`Channel wasn't create ${err} | env: ${url}`);
      }
      var queue = 'hello';
      var msg = 'Hello world from NodeJS Container';

      channel.assertQueue(queue, {
        durable: false
      });

      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    });
  });

  res.status(200).send(`OK! Connected: ${rabbitUrl}`);

});

app.listen(port, () => console.log(`Server listening on port ${port}!`))
