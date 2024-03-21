import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../utils.js";
import { authToken } from "../utils.js";
import { passportCall, authorization } from "../utils.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get(
  "/",
  async (req, res, next) => {
    const token = req.cookies.jwtCookieToken;

    if (!token) {
      return res.render("profile", { user: null });
    }

    try {
      const decodedToken = jwt.verify(token, PRIVATE_KEY);
      req.user = decodedToken.user;
      next();
    } catch (error) {
      return res.render("profile", { user: null });
    }
  },
  authorization("user"),
  (req, res) => {
    res.render("profile", {
      user: req.user,
    });
  }
);

router.get("/error", (req, res) => {
  res.render("error");
});

export default router;
