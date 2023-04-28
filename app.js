const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users");
const methodOverride = require("method-override");
const mongoSanitize = require("express-mongo-sanitize");
const ExpressError = require("./utils/ExpressError");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app1 = 0;
var url =
  "mongodb+srv://sushant2040:VIShnu158@cluster0.69l9e31.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});
const app = express();

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: false }));

app.use(flash());

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.session.user_id;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");

app.use("/products", productRoutes);
app.use("/", userRoutes);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT || 3000, () => {
  console.log("Serving on port 3000");
});
