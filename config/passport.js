"use strict";

const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const jwtSecret = require("./keys");
const User = require("../models/user");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret.secret
};

module.exports = passport => {
  passport.use(
    "jwt",
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) {
          console.log("User found in database.");
          done(null, user);
        }
        console.log("User not found in database.");
        done(null, false);
      } catch (err) {
        console.log(err);
        done(err, false);
      }
    })
  );
};
