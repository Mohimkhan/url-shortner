const express = require('express');
const app = express();
const { connectMongoDB } = require('./connection');
const urlRouter = require('./routes/url');
const Url = require('./models/url');

// config
const PORT = 8080;

// connect mongo db
connectMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => {
        console.log(`MongoDB connected...`);
    })
    .catch(err => console.log(`MongoDb erro`, err))


// middlewares
app.use(express.json());
// routes
app.use('/url', urlRouter);

// dynamic route
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await Url.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            }
        }
    })
    res.redirect(entry.redirectUrl);
})

// create server
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})