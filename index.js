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
const dotenv = require('dotenv');
dotenv.config();

// config
const PORT = process.env.PORT || 8000;
const db_url = process.env.DB_URL;

// connect mongo db
connectMongoDB(db_url)
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

    // checks if given url has https:// or http:// prefix
    const urlRegex = /^(https?|http):\/\//i;

    if (!urlRegex.test(entry.redirectUrl)) {
        return res.redirect(`https://${entry.redirectUrl}`);
    }

    res.redirect(entry.redirectUrl);
})

// create server
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})