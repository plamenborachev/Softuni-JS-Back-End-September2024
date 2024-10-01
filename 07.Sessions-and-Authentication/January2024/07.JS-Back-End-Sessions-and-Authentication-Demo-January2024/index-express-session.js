const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'Victoria\'s Secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/', (req, res) => {
    console.log(req.session);

    if (req.session.userInfo) {
        res.send(`Hello ${req.session.userInfo.username}`)
    } else {
        res.send('Please Login');
    }
});

// TODO: set cookie
app.get('/login', (req, res) => {
    res.send(`
    <form action="/login" method="post">
        <label>Username</label>
        <input type="text" name="username" />
        <label>Password</label>
        <input type="password" name="password" />
        <input type="submit" value="login">
    </form>
    `);
});

app.post('/login', (req, res) => {
    req.session.userInfo = req.body;
    req.session.priveInfo = 'SeMiTaq';

    res.end();
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.end();
});

app.listen(5000, () => console.log('Server is listening on http://localhost:5000...'));
