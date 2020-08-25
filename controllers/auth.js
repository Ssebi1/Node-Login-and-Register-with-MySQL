const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    if (!name || !email || !password || !passwordConfirm) {
        return res.render('register', {
            message: 'Fields should not be empty',
        });
    }
    db.query(
        'SELECT user_email FROM users WHERE user_email = ?',
        [email],
        async (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                return res.render('register', {
                    message: 'That email is already in user',
                });
            } else if (password !== passwordConfirm) {
                return res.render('register', {
                    message: 'Passwords do not match',
                });
            } else if (password.length < 4) {
                return res.render('register', {
                    message: 'Password has to be longer',
                });
            }

            let hashedPassword = await bcrypt.hash(password, 8);

            db.query(
                'INSERT INTO users SET ?',
                {
                    user_name: name,
                    user_email: email,
                    user_password: hashedPassword,
                },
                (error, result) => {
                    if (error) throw error;
                    else {
                        return res.render('register', {
                            message: 'User registred',
                        });
                    }
                }
            );
        }
    );
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Fields should not be empty',
            });
        }
        db.query(
            'SELECT * FROM users WHERE user_email = ?',
            [email],
            async (error, result) => {
                if (error) throw error;

                if (result.length == 0) {
                    return res.status(400).render('login', {
                        message: 'This email is not registered',
                    });
                }

                if (
                    !(await bcrypt.compare(password, result[0].user_password))
                ) {
                    return res.status(401).render('login', {
                        message: 'Email or password is incorrect',
                    });
                }

                res.cookie('id', result[0].user_id);
                res.cookie('username', result[0].user_name);
                res.cookie('email', result[0].user_email);
                res.status(200).redirect('/');
            }
        );
    } catch (error) {
        console.log(error);
    }
};
