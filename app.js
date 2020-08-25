const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const port = 8080;
const cookieParses = require('cookie-parser');

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParses());

app.set('view engine', 'hbs');

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected...');
});

app.listen(port, (err) => {
    if (err) throw err;
    console.log('Connected');
});

//Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
