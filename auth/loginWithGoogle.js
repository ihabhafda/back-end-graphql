const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Users } = require('../models');

const Google_CALLBACK_URL = 'http://localhost:5000/api/v1/auth/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: Google_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('🚀 ~ file: loginWithGoogle.js:16 ~ profile:', profile);
      const defaultUser = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        userName: `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        googleId: profile.id,
      };
      try {
        const user = await Users.findOrCreate({
          where: { googleId: defaultUser.googleId },
          defaults: defaultUser,
        });
        if (!user) {
          return done(new Error('something went wrong', null));
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
      done(null, profile);
    },
  ),
);

passport.serializeUser((users, done) => {
  done(null, users.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
