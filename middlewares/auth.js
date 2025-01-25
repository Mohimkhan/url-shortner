import { appName } from "../constants/index.js";
import { options } from "../constants/index.js";
import { getUser } from "../service/auth.js";
import { v4 as uuidv4 } from "uuid";

export function checkForAuthentication(req, res, next) {
  const tokenValue = req.cookies?.[`${appName}-token`];
  const tempUserId = req.cookies?.[`${appName}-tempUserId`];

  req.user = null;

  if (!tokenValue) {
    if (!tempUserId) {
      res.cookie(`${appName}-tempUserId`, uuidv4(), options);
      return next();
    }
  }

  const user = getUser(tokenValue);

  req.user = user;

  return next();
}

export function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role)) return res.end("UnAuthorized");

    return next();
  };
}
