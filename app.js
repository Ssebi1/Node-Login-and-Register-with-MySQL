const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const port = 8080;

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected...');
});

app.listen(port, (err) => {
    if (err) throw err;
    console.log('Connected');
});

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.get('/register', (req, res) => {
    res.render('register.hbs');
});

app.get('/login', (req, res) => {
    res.render('login.hbs');
});
