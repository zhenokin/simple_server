var express = require('express');
var router = express.Router();

const News = require('../news/News');
const Users = require('../users/Users');
const { generateId } = require('../news/News.Helpers');
const { 
    setActiveUser,
    canActiveUserDeleteNews,
    canActiveUserEditNews 
} = require('../users/Users.Helpers');

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

router.use((req, res, next) => {
    if (!req.body.activeUser) {
        res.redirect('/');
        res.end();
    } else {
        next();
    }
});

router.get('/news', (req, res, next) => {
    News.find((err, news) => {
        if (err) return console.error(err);
        res.send(news);
    });
});

router.get('/news/:id', (req, res) => {
    News.find({ id: req.params.id },(err, news) => {
        if (err) return console.error(err);
        res.send(news);
    });
});


router.post('/news', (req, res) => {
    if (canActiveUserEditNews()) {
        const { title = '', description = '', id = generateId() } = req.body;
        const newNews = new News({ id, title, description });
    
        newNews.save((err) => {
            if (err) return console.error(err);
            res.send('done');
        });
    } else {
        res.send('U cann\'t edit news');
    }
});

router.put('/news/:id', (req, res) => {
    const { title = '', description = '' } = req.body;
    const { id } = req.params;
    const newNews = new News({ id, title, description });

    newNews.save((err) => {
        if (err) return console.error(err);
        res.send('done');
    });
});

router.delete('/news/:id', (req, res) => {
    if (canActiveUserDeleteNews()) {
        const id = req.params.id;
        News.findOneAndRemove({ id: id }, (err) => {
            if (err) return console.error(err);
            res.send('done');
        });
    } else {
        res.send('U can\'n delete news');
    }
});

module.exports = router;
