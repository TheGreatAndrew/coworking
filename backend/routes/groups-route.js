const express = require('express');
const { body } = require('express-validator');

// Local Imports
const controllers = require('../controllers/groups-controllers');
const { authToken } = require('../roles/roles');


const router = express.Router();

router.get('/:gid', controllers.fetchGroupData);
router.get('/', controllers.fetchGroups);
router.post('/', body('title').isLength({ min: 3, max: 12 }), controllers.createGroup);
router.post('/invite/:gid', controllers.joinGroup);
router.delete('/:gid/members/:uid', controllers.leaveGroup);
// router.delete('/:gid', controllers.deleteGroup);
// router.delete('/kick/:uid', controllers.kickUser);



module.exports = router;
