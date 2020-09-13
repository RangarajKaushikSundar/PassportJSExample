if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const users = [];
const initializePassport = require('./passport.config');
initializePassport(passport, 
  name => users.find(user => user.name === name),
  id => users.find(user => user.id === id)
  );

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/',checkAuth , (req, res) => {
  res.render('index.ejs', { name: req.user.name })
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
});

app.post('/register', checkNotAuthenticated, (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  users.push({
    id: Date.now().toString(),  
    name,
    password
  });
  console.log(users);
  res.redirect('/login');

});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

function checkAuth(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
})

app.listen(3000);

