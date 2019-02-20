'use strict';

const mongoose = require('mongoose');

const dbnName = 'News';
const url = 'mongodb://localhost:27017';

mongoose.connect(`${url}/${dbnName}`, { useNewUrlParser: true });

const newsSchema = new mongoose.Schema({
	id: Number,
	title: String,
	description: String,
	content: String,
	imageUrl: String,
	date: String,
	author: String,
	sourceUrl: String,
	typeOfImage: String,
	isLocalNews: Boolean
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
