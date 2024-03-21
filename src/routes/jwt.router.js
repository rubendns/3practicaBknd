import { Router } from "express";
import userModel from "../services/models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { isValidPassword } from "../utils.js";
import { generateJWToken, PRIVATE_KEY } from "../utils.js";

const router = Router();

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
);

router.get(
    "/githubcallback",
    passport.authenticate("github", {
        session: false,
        failureRedirect: "/github/error",
    }),
    async (req, res) => {
        const user = req.user;
        const tokenUser = {
        name: user.username,
        email: user.email,
        age: user.age,
        role: user.role,
        };
        const access_token = generateJWToken(tokenUser);
        //console.log(access_token);
        res.cookie("jwtCookieToken", access_token, {
        maxAge: 60000,
        httpOnly: true, //No se expone la cookie
        //httpOnly: false //Si se expone la cookie
        });
        res.redirect("/users");
    }
);

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            console.warn("User doesn't exist with email: " + email);
            return res.status(204).send({
                error: "Not found",
                message: "User not found with email: " + email,
            });
        }

        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({
                status: "error",
                error: "Invalid username or password!",
            });
        }

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
        };

        const access_token = generateJWToken(tokenUser);

        res.cookie("jwtCookieToken", access_token, {
            maxAge: 60000,
            httpOnly: false,
        });

        res.send({
            status: "success",
            message: "Login success!",
            user: tokenUser,
        });
        //console.log('Usuario enviado al frontend:', tokenUser);
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: "error",
            error: "Internal application error.",
        });
    }
});

router.post("/register", async (req, res, next) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
        console.log(`User with email ${req.body.email} already exists.`);
        return res.redirect("/api/jwt/fail-register");
        }
        passport.authenticate("register", {
        failureRedirect: "/api/jwtfail-register",
        successRedirect: "/api/jwt/success-register",
        })(req, res, next);
    } catch (error) {
        console.error("Error during registration:", error);
        res
        .status(500)
        .send({ status: "error", message: "Error registering user." });
    }
});

router.get("/success-register", (req, res) => {
    console.log("Registering the following new user:" + req.user.email);
    res
        .status(200)
        .send({ status: "success", message: "User registered successfully." });
});

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.post("/logout", (req, res) => {
    const token = req.cookies.jwtCookieToken;

    if (!token) {
        return res.redirect("/users/login");
    }
    const decodedToken = jwt.verify(token, PRIVATE_KEY);
    const userName = decodedToken.user.name;

    res.clearCookie("jwtCookieToken");

    console.log(`User ${userName} logged out successfully.`);

    res.redirect("/users/login");
});

export default router;
