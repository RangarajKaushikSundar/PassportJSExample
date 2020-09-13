const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByName, getUserById) {
  const authenticateUser = (name, password, done) => {
    const user = getUserByName(name);
    if(!user) {
      return done(null, false, {message: 'No user with that name'});
    }
    console.log('HERE', user);
    if(password === user.password) {
      return done(null, user);
    } else {
      return done(null, false, {message: "Incorrect password"});
    }
  }
  passport.use(new LocalStrategy({usernameField: 'name'}, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  });
}

module.exports = initialize;