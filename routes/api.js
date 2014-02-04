var fse 	= require('fs-extra');

var mail 	= './views/mail/mail.json';
var mailbox = './views/mail/mailboxes.json';

// example of passing a JSON object literally - as we would if this app
// were attached to a backend database / data source
exports.mail = function(req, res) {
	fse.readJson(mail, function(err, packageObj) {
		res.json(packageObj);
	});
};

// load JSON from the fs before responding to routes (as an example)
exports.mailboxes = function(req, res) {
	fse.readJson(mailbox, function(err, packageObj) {
		res.json(packageObj);
	});
};

// simple demonstration of an API replying to a POST request with a 3 sec simulated delay
exports.send = function(req, res) {
	setTimeout(function () {
		res.json({
			result:'true'
		});
	}, 3000);
};
