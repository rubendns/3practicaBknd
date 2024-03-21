import passport from "passport";
import passportLocal from "passport-local";
import GitHubStrategy from "passport-github2";
import jwtStrategy from "passport-jwt";
import userModel from "../services/models/user.model.js";
import { PRIVATE_KEY, createHash } from "../utils.js";

const localStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
    passport.use(
        "github",
        new GitHubStrategy(
        {
            clientID: "Iv1.84f13a76a9373f39",
            clientSecret: "27d29dce2b2039d59cdc9aacb0ac0705336518cc",
            callbackURL: "http://localhost:8080/api/jwt/githubcallback",
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtained from GitHub..");
            //console.log(profile);
            try {
            const user = await userModel.findOne({
                $or: [
                { email: profile._json.html_url },
                { username: profile._json.login },
                ],
            });
            if (!user) {
                console.warn("The user does not exist in the database");
            } else {
                console.log("Validated user for login: " + user.username);
            }
            if (!user) {
                console.warn("A new user was created as " + profile._json.login);
                const newUser = {
                username: profile._json.login,
                email: profile._json.html_url,
                password: "gitHubUserPass",
                gitHubId: profile.id,
                loggedBy: "GitHub",
                rol: "user",
                };
                const result = await userModel.create(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
            } catch (error) {
            return done(error);
            }
        }
        )
    );

    passport.use(
        "jwt",
        new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY,
        },
        async (jwt_payload, done) => {
            console.log("Entering passport Strategy with JWT.");
            try {
            //console.log("JWT obtenido del Payload");
            //console.log(jwt_payload);
            return done(null, jwt_payload.user);
            } catch (error) {
            return done(error);
            }
        }
        )
    );

    passport.use(
        "register",
        new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
            const exist = await userModel.findOne({ email });
            if (exist) {
                console.log("User already exists!!");
                done(null, false);
            }
            const user = {
                first_name,
                last_name,
                email,
                age,
                passwordHash: createHash(password),
            };
            const result = await userModel.create(user);
            return done(null, result);
            } catch (error) {
            return done("Error registering user " + error);
            }
        }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
        let user = await userModel.findById(id);
        done(null, user);
        } catch (error) {
        console.error("Error deserializing user: " + error);
        }
    });
};

const cookieExtractor = (req) => {
    let token = null;
    console.log("Entering Cookie Extractor");
    if (req && req.cookies) {
        console.log("Cookies present...");
        //console.log(req.cookies);
        token = req.cookies["jwtCookieToken"];
        console.log("Token obtained from Cookie");
        //console.log(token);
    }
    return token;
};

export default initializePassport;
