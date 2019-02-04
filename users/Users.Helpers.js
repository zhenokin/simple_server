'use strict';

let activeUser = null;

const getActiveUser = () => activeUser;
const setActiveUser = user => activeUser = user;
const canActiveUserDeleteNews = () => activeUser && activeUser.isAdmin;
const canActiveUserEditNews = () => activeUser && activeUser.isAdmin;
const generateId = () => Date.now();

module.exports = { 
    getActiveUser,
    setActiveUser,
    canActiveUserDeleteNews,
    canActiveUserEditNews,
    generateId
};
