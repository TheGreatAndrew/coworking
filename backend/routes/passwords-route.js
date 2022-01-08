const express = require('express');

// Local Imports
const controllers = require('../controllers/passwords-controllers');
const { authToken, authAdminOfAGroup } = require('../roles/roles');


const router = express.Router();

router.post('/', controllers.sendPasswordResetEmail);
router.post('/:uid/:token', controllers.verifyPasswordResetEmail);


module.exports = router;
