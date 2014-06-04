/*global require, console, __dirname, setTimeout*/
/**
 * Simple demo server, expressjs
 */

var fs = require('fs');
var express = require('express');
var app = express();

var FAKE_FAILURE_CHANCE = 0.5;
var FAKE_LAG_TIMEOUT = 5000;
var COMMENTS_FILE_PATH = __dirname + '/public/data/comments.json';

// random generation chance.js
var Chance = require('chance');
var chance = new Chance();

// CouchDB Database
var nano = require('nano')('http://localhost:5984');

// Middleware
app.use(express.bodyParser()); // For form data.

/**
 */
app.post('/addComment', function (req, res) {

	console.log('addComment, body:', req.body);

	// TODO Real validation system.
	var errors = [];
	if (req.body.author === void 0 || req.body.author.trim() === '') {
		errors.push('**author** is required');
	}
	if (req.body.text === void 0 || req.body.text.trim() === '') {
		errors.push('**text** is required');
	}
	if (errors.length > 0) {
		res.send({
			success: false,
			errors: errors
		});
		return;
	}

	// Adding fake server lag for demo purposes - see FAKE_LAG_TIMEOUT.
	console.log('fake lag starting...');
	setTimeout(function () {

		console.log('fake lag complete, processing');

		// Mock a failure scenario
		if (Math.random() < FAKE_FAILURE_CHANCE) {
			res.send(500, { error: 'Something blew up! :)' });
			return;
		}

		// Load current comments file in lieu of a databse.
		// TODO Use something like pouchdb for online/offline sync?
		var comments = JSON.parse(fs.readFileSync(COMMENTS_FILE_PATH));

		// Append
		comments.push(req.body);

		// Write back to disk
		fs.writeFile(COMMENTS_FILE_PATH, JSON.stringify(comments, null, 4), function (err) {
			if (err) {
				// Basic response payload to let the frontend know it worked.
				res.send(500, { error: 'Failed to update comments file on server' });
			} else {
				// Basic response payload to let the frontend know it worked.
				res.send({
					success: true,
					message: 'Comment added successfully!'
				});
			}
		});

	}.bind(this), FAKE_LAG_TIMEOUT);

});


app.put('/generate-users', function (req, res) {
    var cdb = nano.use('users');
    var users = {docs: []};

    for (var i = 0; i <= 5000; i++) {
        var first = chance.first();
		var last = chance.last();
        var full = [first, last].join(' ');
        users.docs.push({
            firstName: first,
            lastName: last,
            email: [full.replace(' ', '_').toLowerCase(), chance.domain()].join('@'),
            //phone: chance.phone(),
            //address: chance.address(),
            //gender: chance.gender(),
            updated: chance.date().toJSON()
        });
    }

    cdb.bulk(users, function (err, body) {
        res.send({
            err: err
        });
    });

});

// Default folder is the public sub-folder.
app.use(express.static(__dirname + '/public'));

app.listen(3000);

console.log('Server running, to view: http://localhost:3000');
