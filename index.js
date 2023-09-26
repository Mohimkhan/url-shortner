const express = require('express');
const app = express();
const path = require('path');
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
// set view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/test', async (req, res) => {
    const allUrls = await Url.find({});
    return res.render('home', {
        urls: allUrls
    });
})

// dynamic route
app.get('/url/:shortId', async (req, res) => {
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