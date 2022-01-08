const express = require('express');
const { body } = require('express-validator');

// Local Imports
const controllers = require('../controllers/groups-controllers');
const { authToken, authAdminOfAGroup } = require('../roles/roles');

const router = express.Router();

// group 
router.get('/:gid', authToken, controllers.fetchGroupData);
router.get('/', authToken, controllers.fetchGroups);
router.post('/', body('title').isLength({ min: 3, max: 12 }), authToken, controllers.createGroup);
router.post('/invite/:gid', authToken, controllers.joinGroup);
router.delete('/:gid/members/:uid', authToken, controllers.leaveGroup);
router.put('/edit', body('title').isLength({ min: 3, max: 12 }), authToken, authAdminOfAGroup, controllers.editGroup);

router.delete('/:gid', controllers.deleteGroup);
// router.delete('/kick/:uid', controllers.kickUser);

module.exports = router;
