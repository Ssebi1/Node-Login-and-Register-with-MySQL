const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.cookies.username) res.render('index');
    else res.render('indexLogged', { name: req.cookies.username });
});

router.get('/login', (req, res) => {
    if (!req.cookies.username) res.render('login');
    else res.redirect('/');
});

router.get('/register', (req, res) => {
    if (!req.cookies.username) res.render('register');
    else res.redirect('/');
});

module.exports = router;
