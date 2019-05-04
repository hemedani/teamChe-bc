const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const localStrategy = require("passport-local");

const localLogin = new localStrategy({ usernameField: "email" }, (email, pass, done) => {
  let loEmail = email.toLowerCase();
  User.findOne(
    { email: loEmail },
    "_id email name familyName phone password address level pic fcmToken officerEt phoneValidate"
  )
    .exec()
    .then(us => {
      if (us) {
        us.comparePass(pass, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false);
          }

          return done(null, us);
        });
      } else {
        {
          return done("can not find user");
        }
      }
    })
    .catch(err => {
      if (err) {
        return done(err);
      }
    });
});

const jwtOptions = { jwtFromRequest: ExtractJwt.fromHeader("sabti"), secretOrKey: config.secret };

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub)
    .exec()
    .then(us => {
      if (us) {
        return done(null, us);
      } else {
        return done(null, false);
      }
    })
    .catch(err => {
      if (err) {
        return done(err);
      }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
