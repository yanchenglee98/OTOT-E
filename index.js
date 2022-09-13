const express = require('express');
const axios = require('axios');
const cors = require('cors');
const redis = require('redis');

let redisClient = redis.createClient();

// (async () => {
//   redisClient = redis.createClient();

//   redisClient.on("error", (error) => console.error(`Error : ${error}`));

//   await redisClient.connect();
// })();

if (!redisClient) {
    console.log("cannot connect to redis");
} else {
    console.log("connected to redis");
}

const DEFAULT_EXPIRATION = 3600;

const app = express();
app.use(express.urlencoded( {extended: true}));
app.use(cors());

app.get("/photos", async (req, res) => {
    redisClient.get(`photos`, async (error, photos) => {
        if (error) console.error(error);
        if (photos != null) {
            console.log("cache hit")
            return res.json(JSON.parse(photos))
        } else {
            console.log("cache miss")
            const {data} = await axios.get(
                "https://jsonplaceholder.typicode.com/photos"
            )
            redisClient.setex(
                `photos`,
                DEFAULT_EXPIRATION,
                JSON.stringify(data)
            )
            res.json(data)
        }
    })
})

// Setup server port
var port = process.env.PORT || 3000;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Listening on port " + port);
});