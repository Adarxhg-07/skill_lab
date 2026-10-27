const router = require('express').Router();
const ctrl = require('../controllers/taskController');
const studentTaskCtrl = require('../controllers/taskController');

router.get('/', ctrl.getTasks);
router.post('/', ctrl.createTask);
router.patch('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

module.exports = router;
