var express = require('express');
var router = express.Router();

const News = require('../news/News');
const { generateId } = require('../news/News.Helpers');
const {
    canActiveUserDeleteNews,
    canActiveUserEditNews
} = require('../users/Users.Helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('123134');
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
