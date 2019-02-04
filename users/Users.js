'use strict';

const mongoose = require('mongoose');

const dbnName = 'Users';
const url = 'mongodb://localhost:27017';

mongoose.connect(`${url}/${dbnName}`, { useNewUrlParser: true });

const usersSchema = new mongoose.Schema({
    id: Number,
    name: String,
    pass: String,
    isAdmin: Boolean
});

const News = mongoose.model('Users', usersSchema);

module.exports = News;