const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());


// Postgres Client Setup
const { Pool } = require('pg');

const pgClient = new Pool({
    host: keys.pgHost,
    port: keys.pgPort,
    user: keys.pgUser,
    password: keys.pgPassword,
    database: keys.pgDatabase,
});

pgClient
    .on('error', () => console.log('Lost Postgres Database Connection'));

pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(error => console.log(error));


// Redis Client Setup
const redis = require('redis');

const redisClient = redis.createClient({
     host: keys.redisHost,
     port: keys.redisPort,
     retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();


// Express Route Handlers
app.get('/', (req, res) => {
    res.send('Success!');
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (error, values) => {
        res.send(values);
    });
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

app.post('/values', async (req, res) => {
    const value = req.body.value;

    if (parseInt(value) > 40) {
        return res.status(422).send('Value is too high to calculate');
    }
    redisClient.hset('values', value, 'Empty Value');
    redisPublisher.publish('insert', value);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [value]);

    res.send({ working: true });
});


// Express Listener
app.listen(5000, error => {
    console.log('Server is listening on port 5000');
});
