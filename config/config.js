var path = require('path');

var config = {
    db: {
        url: 'mongodb://' + process.env.VERSIONING_DB_HOST + ':' + process.env.VERSIONING_DB_PORT  + '/' + process.env.VERSIONING_DB_NAME,
        // url: 'mongodb://localhost:27017/cicd'
        username: process.env.VERSIONING_DB_USERNAME,
        password: process.env.VERSIONING_DB_PASSWORD,
        autoIndex: false
    }
};

module.exports = config;