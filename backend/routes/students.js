const router = require('express').Router();
const ctrl = require('../controllers/studentController');

router.get('/', ctrl.getStudents);
router.get('/:id', ctrl.getStudent);
router.post('/', ctrl.createStudent);
router.put('/:id', ctrl.updateStudent);
router.delete('/:id', ctrl.deleteStudent);

module.exports = router;
