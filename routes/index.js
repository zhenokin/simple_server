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
	res.send(
		'U must log in (POST request to /aut { name: ?, pass: ? }) or sign up (post request to /reg { name: ?, pass: ?, isAdmin: Boolean })'
	);
});

router.get('/cleanAcc', (req, res) => {
	Users.collection.drop();
	res.send('cleare Accounts').end();
});
router.get('/cleanNews', (req, res) => {
	News.collection.drop();
	res.send('cleare NEws').end();
});

router.get('/logOut', (req, res) => {
	setActiveUser(null);
	res.send(
		JSON.stringify({
			status: 'done'
		})
	);
});

router.get('/getActiveUser', (req, res) => {
	res.send(JSON.stringify(req.body.activeUser));
});
router.post('/aut', (req, res, next) => {
	const { name, pass, activeUser } = req.body;
	if (activeUser) {
		res.status(500).send(
			JSON.stringify({ status: `failed', text: 'There is active user:${activeUser.name}` })
		);
	} else {
		Users.find({ name, pass }, (err, user) => {
			if (err) return console.error(err);
			if (user.length) {
				setActiveUser(user[0]);
				res.send(
					JSON.stringify({
						status: 'done',
						userInfo: { name: user.name, imageUrl: user.imageUrl, id: user.id }
					})
				).end();
			} else {
				Users.find({ name }, (err, users) => {
					if (err) return console.error(err);
					if (users.length) {
						res.status(400).send(
							JSON.stringify({
								status: 'failed',
								text: 'Pass or Name are not correct'
							})
						);
					} else {
						res.status(400).send(
							JSON.stringify({
								status: 'failed',
								text: "There isn'n such user"
							})
						);
					}
				});
			}
		});
	}
});

router.post('/reg', (req, res, next) => {
	const { name, pass, isAdmin = false, imageUrl = '', activeUser } = req.body;
	const id = generateId();
	if (activeUser) {
		res.status(500).send(
			JSON.stringify({ status: `failed', text: 'There is active user:${activeUser.name}` })
		);
	} else {
		Users.find({ name }, (err, users) => {
			if (err) return console.log(err);
			if (users.length) {
				res.status(500).send(
					JSON.stringify({ status: 'failed', text: 'There is such user' })
				);
			} else {
				const newUser = new Users({ id, name, pass, imageUrl, isAdmin });
				newUser.save((err, user) => {
					if (err) return console.error(err);
					setActiveUser(newUser);
					res.send(
						JSON.stringify({
							status: 'done',
							userInfo: {
								name: newUser.name,
								imageUrl: newUser.imageUrl,
								id: newUser.id
							}
						})
					);
				});
			}
		});
	}
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
	News.find({ id: req.params.id }, (err, news) => {
		if (err) return console.error(err);
		res.send(news);
	});
});

router.post('/news', (req, res) => {
	// if (canActiveUserEditNews()) {
	// 	const { title = '', description = '', id = generateId() } = req.body;
	// 	const newNews = new News({ id, title, description });

	// 	newNews.save(err => {
	// 		if (err) return console.error(err);
	// 		res.send('done');
	// 	});
	// } else {
	// 	res.send("U cann't edit news");
	// }
	const news = req.body;
	const { id } = news;
	News.findOneAndUpdate({ id }, news, err => {
		if (err) return console.error(err);
		res.send(JSON.stringify({ done: true }));
	});
});

router.put('/news', (req, res) => {
	const info = req.body;
	info.id = generateId();
	info.isLocalNews = true;
	const newNews = new News(info);

	newNews.save(err => {
		if (err) return console.error(err);
		res.send(JSON.stringify({ done: true }));
	});
});

router.delete('/news/:id', (req, res) => {
	if (canActiveUserDeleteNews()) {
		const id = req.params.id;
		News.findOneAndRemove({ id: id }, err => {
			if (err) return console.error(err);
			res.send('done');
		});
	} else {
		res.send("U can'n delete news");
	}
});

module.exports = router;
