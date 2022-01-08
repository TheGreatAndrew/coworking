const express = require('express');

// Local Imports
const controllers = require('../controllers/messages-controllers');
const { authToken, authAdminOfAGroup } = require('../roles/roles');


const router = express.Router();

router.get('/:gid', authToken, controllers.fetchMessages);
router.post('/', authToken, controllers.sendMessage);
router.delete('/:mid', authToken, controllers.deleteMessage);

module.exports = router;
