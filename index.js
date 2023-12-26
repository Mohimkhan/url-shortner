const express = require('express');
const app = express();
const path = require('path');
const { connectMongoDB } = require('./connection');
const urlRouter = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const userRouter = require('./routes/user');
const Url = require('./models/url');
const { restrictTo, checkForAuthentication } = require('./middlewares/auth');
const cookieParser = require('cookie-parser');

// config
const PORT = 8000;

// connect mongo db
connectMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => {
        console.log(`MongoDB connected...`);
    })
    .catch(err => console.log(`MongoDb erro`, err))


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(checkForAuthentication);
// routes
app.use('/url', restrictTo(['NORMAL', 'ADMIN']), urlRouter);
app.use('/', staticRouter);
app.use('/user', userRouter);
// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

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