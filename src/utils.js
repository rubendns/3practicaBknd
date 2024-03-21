import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import {faker} from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generamos y validamos el hash
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
  //console.log(`Datos a validar: user-password: ${user.passwordHash}, password: ${password}`);
  return bcrypt.compareSync(password, user.passwordHash);
};

//JSON Web Tokens JWT functinos:
export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";

export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "120s" });
};

export const authToken = (req, res, next) => {
  //El JWT token se guarda en los headers de autorización.
  const authHeader = req.headers.authorization;
  console.log("Token present in header auth:");
  console.log(authHeader);
  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "User not authenticated or missing token." });
  }
  const token = authHeader.split(" ")[1]; //Se hace el split para retirar la palabra Bearer.
  //Validar token
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res.status(403).send({ error: "Token invalid, Unauthorized!" });
    //Token OK
    req.user = credentials.user;
    console.log("The Token information is extracted:");
    console.log(req.user);
    next();
  });
};

// para manejo de errores
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    console.log("Entering to call strategy: ");
    console.log(strategy);
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      console.log("User obtained from the strategy:");
      console.log(user.email);
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send("Unauthorized: User not found in JWT");

    if (req.user.role !== role) {
      return res
        .status(403)
        .send("Forbidden: The user does not have permissions with this role.");
    }
    next();
  };
};

export const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    code: faker.string.uuid(),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
    stock: faker.string.numeric(2),
    category: faker.commerce.department(),
    thumbnail: faker.image.url(),
  };
};

export default __dirname;
