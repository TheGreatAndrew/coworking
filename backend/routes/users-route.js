const express = require('express');
const { body } = require('express-validator');

// Local Imports
const controllers = require('../controllers/users-controllers');
const { authToken } = require('../roles/roles');

const router = express.Router();

// user
router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6, max: 20 }), controllers.login);
router.post(
  '/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 20 }),
  body('username').isLength({ min: 3, max: 12 }),
  controllers.signup
);
router.put('/edit', body('username').isLength({ min: 3, max: 12 }), authToken, controllers.edit);
router.post('/guest', controllers.guest);
router.post('/verify', controllers.verify); 
router.post('/ban', body('email').isEmail(), authToken, controllers.banUser);

// user's group
router.get('/groups/:uid', authToken, controllers.fetchJoinedGroups);

// forrest
router.put('/forrest', authToken, controllers.incrementForrest);
router.get('/forrest/:uid', authToken, controllers.fetchForrest); 

module.exports = router;
