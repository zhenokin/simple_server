var express = require('express');
var router = express.Router();

const Users = require('../users/Users');
const { setActiveUser, generateId } = require('../users/Users.Helpers');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.send('U must log in (POST request to /aut { name: ?, pass: ? }) or sign up (post request to /reg { name: ?, pass: ?, isAdmin: Boolean })');
});

router.post('/aut', (req, res, next) => {
    const { name, pass } = req.body;
    Users.find({ name, pass }, (err, user) => {
        if (err) return console.error(err);
        if (user.length) {
            setActiveUser(user);
            res.send('complete');
        } else {
            Users.find({ name }, (err, users) => {
                if (err) return console.error(err);
                if (users.length) {
                    res.send('Pass or Name are not correct'); 
                } else {
                    res.send('There isn\'n such user');
                }
            });
        }
    });
});

router.post('/reg', (req, res, next) => {
    const { name, pass, isAdmin = false } = req.body;
    const id = generateId();
    const user = new Users({ id, name, pass, isAdmin });
    user.save(err => {
        if(err) return console.error(err);
        setActiveUser(user);
        res.send('access completed');
    });
});



module.exports = router;
