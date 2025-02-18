import shortid from "shortid";
import Url from "../models/url.js";
import { appName } from "../constants/index.js";

export async function handleGeneratedNewShortUrl(req, res) {
  const body = req.body;
  const tempUserId = req.cookies?.[`${appName}-tempUserId`];
  if (!body.url) return res.status(400).json({ err: "url is required" });
  const shortID = shortid();
  let count;

  const path = `${req.protocol}://${req.get("host")}/url`;

  if (tempUserId) {
    count = await Url.countDocuments({
      tempUserId,
    });
  }

  if (count && count >= 3 && !req?.user) {
    return res.redirect("/login");
  }

  if (!req?.user) {
    await Url.create({
      shortId: shortID,
      redirectUrl: body.url,
      visitHistory: [],
      tempUserId,
    });

    return res.render("home", { id: shortID, path });
  }

  await Url.create({
    shortId: shortID,
    redirectUrl: body.url,
    visitHistory: [],
    createdBy: req.user._id,
    tempUserId: null,
  });

  return res.render("home", { id: shortID, path });
}

export async function handleShortIdAnalytics(req, res) {
  const shortId = req.params.shortId;

  const result = await Url.findOne({
    shortId,
  });

  res.status(200).json({
    clicks: result.visitHistory.length,
    timestamps: result.visitHistory,
  });
}
