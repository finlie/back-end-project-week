const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users.schema');
const router = express.Router();

const LOGIN = (req, res) => {
	const { username, password } = req.body;
	User.findOne({ username }, (err, user) => {
		if (err) {
			res.status(403).json({ error: 'Invalid Username/Password' });
			return;
		}
		if (user === null) {
			res.status(422).json({ error: 'No user with that username in our DB' });
			return;
		}
		user.checkPassword(password, (nonMatch, hashMatch) => {
			if (nonMatch !== null) {
				res.status(422).json({ error: 'passwords dont match' });
				return;
			}
			if (hashMatch) {
				const payload = {
					username: user.username,
				};
				const token = jwt.sign(payload, mysecret);
				res.json({ token });
			}
		});
	});
};

router.route('/').post(LOGIN);

module.exports = router;
