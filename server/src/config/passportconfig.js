// config/passport.js
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import User from "../models/User.js";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ providerId: profile.id, provider: "google" });
  if (!user) {
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      provider: "google",
      providerId: profile.id
    });
  }
  return done(null, user);
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ["id", "displayName", "emails"]
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ providerId: profile.id, provider: "facebook" });
  if (!user) {
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      provider: "facebook",
      providerId: profile.id
    });
  }
  return done(null, user);
}));
