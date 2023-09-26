const express = require('express');
const app = express();
const path = require('path');
const { connectMongoDB } = require('./connection');
const urlRouter = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
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
app.use(express.urlencoded({ extended: false }));
// routes
app.use('/url', urlRouter);
app.use('/', staticRouter);
// set view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

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