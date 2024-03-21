import { Router } from "express";
import userModel from "../services/models/user.model.js";
import passport from "passport";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    {
    }
  }
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/fail-login" }),
  async (req, res) => {
    const user = req.user;
    req.session.user = {
      name: user.first_name
        ? `${user.first_name} ${user.last_name}`
        : user.username,
      email: user.email,
      rol: user.rol,
    };
    res.redirect("/products");
  }
);

router.post("/register", async (req, res, next) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      console.log(`User with email ${req.body.email} already exists.`);
      return res.redirect("/api/sessions/fail-register");
    }
    passport.authenticate("register", {
      failureRedirect: "/api/sessionsfail-register",
      successRedirect: "/api/sessions/success-register",
    })(req, res, next);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ status: "error", message: "Error registering user." });
  }
});

router.post(
  "/login",
  (req, res, next) => {
    if (
      req.body.email === "adminCoder@coder.com" &&
      req.body.password === "adminCod3r123"
    ) {
      req.adminUser = {
        email: "adminCoder@coder.com",
        password: "admin",
      };
      return next();
    }
    passport.authenticate("login", {
      failureRedirect: "api/sessions/fail-login",
    })(req, res, next);
  },
  async (req, res) => {
    const user = req.adminUser || req.user;
    console.log("User found to login: " + user.email);
    req.session.user = {
      name: `${user.first_name}`,
      email: user.email,
      age: user.age,
    };
    if (req.adminUser) {
      req.session.rol = "admin";
      req.session.user = {
        name: "Admin",
        email: "adminCoder@coder.com",
        rol: "admin",
        age: 0,
      };
      return res.send({
        status: "success",
        payload: req.session.user,
        message: "Admin login done :)",
      });
    }
    try {
      const dbUser = await userModel.findOne({ email: user.email });
      if (!dbUser) {
        return res
          .status(401)
          .send({ status: "error", error: "Incorrect credentials" });
      }
      req.session.rol = "user";
      req.session.user = {
        name: `${dbUser.first_name}`,
        email: dbUser.email,
        rol: req.session.rol,
        age: dbUser.age,
      };
      res.send({
        status: "success",
        payload: req.session.user,
        message: "User login done :)",
      });
    } catch (error) {
      return res
        .status(500)
        .send({ status: "error", msg: "Internal Server Error" });
    }
  }
);

router.get("/success-register", (req, res) => {
  console.log("Registering the following new user:", req.user);
  res.status(200).send({ status: "success", message: "User registered successfully." });
});

router.get("/failure", (req, res) => {
  res.status(404).send("Error: Page not found");
});

router.get("/fail-register", (req, res) => {
  res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
  res.status(401).send({ error: "Failed to process login!" });
});

router.post("/logout", (req, res) => {
  const userName =
    req.session.user && req.session.user.name
      ? req.session.user.name
      : "Unknown User";
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res
        .status(500)
        .send({ status: "error", msg: "Internal Server Error" });
    }
    console.log(`User ${userName} logged out successfully.`);
    res.redirect("/users/login");
  });
});

export default router;
