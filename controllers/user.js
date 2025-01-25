import { options, appName } from "../constants/index.js";
import Url from "../models/url.js";
import User from "../models/user.js";
import { setUser } from "../service/auth.js";

export async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field === undefined)) {
    return res.render("signup", {
      error: "All fields should be filled",
    });
  }

  await User.create({
    name,
    email,
    password,
  });

  return res.redirect("/");
}

export async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const tempUserId = req.cookies[`${appName}-tempUserId`];

  if ([email, password].some((field) => field === undefined)) {
    return res.render("login", {
      error: "All fields should be filled",
    });
  }

  const user = await User.findOne({ email });

  if (!user)
    return res.render("login", {
      error: "Invalid Email or Password",
    });

  const isPasswordValid = await user.isPasswordValid(password);

  if (!isPasswordValid) {
    return res.render("login", {
      error: "Invalid password",
    });
  }

  if (tempUserId) {
    await Url.updateMany(
      { tempUserId },
      { $set: { createdBy: user._id, tempUserId: null } }
    );
    res.clearCookie(`${appName}-tempUserId`);
  }

  const token = setUser(user);

  res.cookie(`${appName}-token`, token, options);
  return res.redirect("/");
}

export async function handleUserLogout(req, res) {
  const tokenValue = req.cookies?.[`${appName}-token`];

  if (!tokenValue) return res.redirect("/login");

  res.clearCookie(`${appName}-token`, options);

  return res.redirect("/login");
}
