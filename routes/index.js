var express = require('express');
var router = express.Router();

const News = require('../news/News');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/news', (req, res, next) => {
  res.send(JSON.stringify(News));
});

router.get('/news/:id', (req, res) => {
  res.render('news', { title: News[req.params.id].title, description: News[req.params.id].description }, (err, html) => { console.log(html)});
});


router.post('/news', (req, res) => {
  res.send('done');
});

router.put('/news/:id', (req, res) => {
  const data = req.body;
  const params = req.params;
  if(News[params.id]) {
    res.send('There is the same news')
  } else {
    News[params.id] = data;
    res.send('done')
  }
});

router.delete('/news/:id', (req, res) => {
  const id = req.params.id;
  if (News[id]) {
    News[id] = undefined;
    res.send('done')
  } else {
    res.send('There is\'n this news');
  }
})
module.exports = router;
