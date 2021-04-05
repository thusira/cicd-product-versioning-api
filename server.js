var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');

var index = require('./routes/index');
var versions = require('./routes/versions');
var releases = require('./routes/releases');

var options = {
    user: config.db.username,
    pass: config.db.password,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
};
var dbUrl = config.db.url;

var db = mongoose.connect(dbUrl, options).then(
    (res) => {
        console.log("Connected to Database Successfully.");
    }
).catch((e) => {
    console.log("Connection to database failed.", e);
});

var app = express();

//set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//set static folder - uncomment if need to expose static files as urls. eg: http://localhost:3000/template.json
// app.use(express.static('resources'));

//load body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//load routes
app.use('/', index);
app.use('/api/versioning', versions);
app.use('/api/release', releases);

var port = 3000;
app.listen(port, function () {
    console.log('Server started on port: ' + port);
})