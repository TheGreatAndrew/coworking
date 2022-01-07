const express = require('express');

// Local Imports
const controllers = require('../controllers/passwords-controllers');

const router = express.Router();

router.post('/', controllers.sendPasswordResetEmail);


module.exports = router;
