import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import flash from "express-flash";
import path from "path";
import morgan from "morgan";
import expressValidator from "express-validator";
import { SESSION_SECRET } from "./util/secrets";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
}));
app.use(flash());
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.get("/", (req, res, next) => {
    res.render("index");
});
app.post("/post", (req, res, next) => {
    req.assert("email", "Email is not valid").isEmail();

    const errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        return res.status(400).json({
            error: errors
        });
    }
    return res.json("index");
});
/**
 * Primary app routes.
 */

export default app;