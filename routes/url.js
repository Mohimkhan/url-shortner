import express from "express";
import {
  handleGeneratedNewShortUrl,
  handleShortIdAnalytics,
} from "../controllers/url.js";
const router = express.Router();

router.post("/", handleGeneratedNewShortUrl);
router.get("/analytics/:shortId", handleShortIdAnalytics);

export default router;
