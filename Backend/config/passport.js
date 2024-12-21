import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.models.js";

export default function passportConfig() {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          const isMatch = await user.isPasswordCorrect(password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing User:", user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      console.log("Deserializing User:", user);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}














// User submits login form → Email and password are sent to the server.
// Passport Local Strategy:
// Looks up the user by email.
// Validates the password.
// Session Handling:
// On success, the user id is stored in the session (serialize).
// On subsequent requests, the full user is retrieved from the session (deserialize).