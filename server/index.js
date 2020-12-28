const express = require("express")
const cors = require("cors")
const passport = require("passport")

const FacebookStrategy = require("passport-facebook").Strategy
const AmazonStrategy = require("passport-amazon").Strategy
const GithubStrategy = require("passport-github").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy
const InstagramStrategy = require("passport-instagram").Strategy
const SpotifyStrategy = require("passport-spotify").Strategy
const TwitchStrategy = require("passport-twitch.js").Strategy

const keys = require("../config")
const chalk = require("chalk")
let user = {}

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((user, cb) => {
  cb(null, user)
})

//Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: keys.FACEBOOK.clientID,
  clientSecret: keys.FACEBOOK.clientSecret,
  callbackURL: "/auth/facebook/callback"
},
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)))
    user = { ...profile, }
    return cb(null, profile)
  }
))

//Amazon Strategy
passport.use(new AmazonStrategy({
  clientID: keys.AMAZON.clientID,
  clientSecret: keys.AMAZON.clientSecret,
  callbackURL: "/auth/amazon/callback"
},
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)))
    user = { ...profile, }
    return cb(null, profile)
  }
))

const app = express()
app.use(cors())
app.use(passport.initialize())

app.get("auth/facebook", passport.authenticate("facebook"))
app.get("auth/facebook/callbalk", 
  passport.authenticate(
    ("facebook"), 
    (req, res) => { 
      res.redirect("/profile")
    }
  )
)

app.get("/auth/amazon", passport.authenticate("amazon", {
  scope: ["profile"]
}))
app.get("/auth/amazon/callback",
  passport.authenticate("amazon"),
  (req, res) => {
      res.redirect("/profile");
  }
)


const PORT = process.env.PORT || 5000
app.listen(PORT)