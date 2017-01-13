const express = require('express');
const request = require('request');
const home = require('./views/home');
const app = express();

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send(`Please visit http://localhost:${port}/:username to see a user's GitHub information.`);
});

app.get('/:username', (req, res) => {
	const username = req.params.username;
	const options = {
		url: `https://api.github.com/users/${username}`,
		headers: {
			'User-Agent': 'zackharley'
		}
	}

	request(options, (error, response, body) => {
		if(!error && response.statusCode === 200) {
			body = JSON.parse(body);
			let user = {
				avatarUrl: body.avatar_url,
				profileUrl: body.html_url,
				name: body.name,
				bio: body.bio,
				location: body.location,
				repos: body.public_repos,
				followers: body.followers,
				following: body.following,
				username
			};

			res.send(home(user));
		} else {
			res.status(response.statusCode).send(error || body);
		}
	});
});

app.listen(port, () => {
	console.log(`GitHub information grabber listening at http://localhost:${port}`);
})
