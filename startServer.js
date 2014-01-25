
/*********************
 * Module dependencies
 *********************/

var express = require('express'),
	routes  = require('./routes'),
	api 	= require('./routes/api'),
	http    = require('http'),
	path    = require('path');

var app = module.exports = express();

app.engine('html', require('ejs').renderFile);

/***************
 * Configuration
 ***************/
 
// globals
app.locals({
	title: 'Simple Email v1.0'
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

/********
 * Routes
 ********/

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON APIs
app.get('/api/mail', api.mail);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**************
 * Start Server
 **************/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
