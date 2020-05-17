// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const methodOverride = require('method-override');
const database   = require("./database");

// PG database client/connection setup
// const { Pool } = require('pg');
// const dbParams = require('./lib/db.js');
// const db = new Pool(dbParams);
// db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  secret: 'midterm',
  // Cookie Options
  maxAge: 500 * 60 * 1000 // 5 minutes
}));
app.use(methodOverride('_method'));


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

const resourceRoutes = require("./routes/resources");
const signUpRoutes = require("./routes/signup");
const homepageRoutes = require("./routes/homepage")
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout");
const profileRoutes = require("./routes/profile");
const myResourcesRoutes = require("./routes/myResources");
const uploadResourceRoutes = require("./routes/upload");


// CSS Links
app.use("/styles",express.static(__dirname + "/styles"));

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/resources", resourceRoutes(database));
app.use("/signup", signUpRoutes(database));
app.use("/login", loginRoutes(database));
app.use("/logout", logoutRoutes(database));
app.use("/profile", profileRoutes(database));
app.use("/myresources", myResourcesRoutes(database));
app.use("/upload", uploadResourceRoutes(database));
app.use("/", homepageRoutes(database));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
