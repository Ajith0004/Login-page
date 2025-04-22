// app.js
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// Session setup
app.use(session({
  secret: 'ajith-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 5 // 5 minutes
  }
}));

// Dummy login credentials
const USER = {
  username: 'ajith',
  password: '12345'
};

// Routes

// GET: Login page
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// POST: Login form
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    res.redirect('/home');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// GET: Protected Home Page
app.get('/home', (req, res) => {
  if (req.session.user) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.render('home', { user: req.session.user });
  } else {
    res.redirect('/');
  }
});


// GET: Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});