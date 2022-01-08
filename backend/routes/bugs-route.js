const express = require('express');
const { authToken } = require('../roles/roles');


// Local Imports
const controllers = require('../controllers/bugs-controllers');

const router = express.Router();

router.get('/', authToken, controllers.fetch);
router.post('/', authToken, controllers.report);

module.exports = router;
