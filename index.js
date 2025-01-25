import express from "express";
import path from "path";
import { connectMongoDB } from "./connection.js";
import urlRouter from "./routes/url.js";
import staticRouter from "./routes/staticRouter.js";
import userRouter from "./routes/user.js";
import Url from "./models/url.js";
import { restrictTo, checkForAuthentication } from "./middlewares/auth.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

/**
 * * Login route should convert the tempUserId to actual Id
 * * Make the home page ui for responsive and accessiable
*/

// config
const PORT = process.env.PORT || 8000;
const db_url = process.env.DB_URL;
const app = express();


// define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connect mongo db
connectMongoDB(db_url)
  .then(() => {
    console.log(`MongoDB connected...`);
    // create server
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => console.log(`MongoDb erro`, err));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

// routes
app.use("/url", urlRouter);
app.use("/", staticRouter);
app.use("/user", userRouter);

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// dynamic route
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await Url.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  // checks if given url has https:// or http:// prefix
  const urlRegex = /^(https?|http):\/\//i;

  if (!urlRegex.test(entry.redirectUrl)) {
    return res.redirect(`https://${entry.redirectUrl}`);
  }

  res.redirect(entry.redirectUrl);
});
