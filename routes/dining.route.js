const express = require('express');
const router = express.Router();
const { getLoginUser, diningCreate, getDining, studentCreate, getStudents, updateDiningFee, declarationCreate, mealSwitch, getDeclaration, setStudentLogin } = require('../controllers/dining.controller');


// created data
router.post('/student/setLogin', getLoginUser);
router.post('/dining/add', diningCreate);
router.post('/students/declaration', declarationCreate);
router.post('/student/add', studentCreate);


//  api of all get
router.get('/dinings', getDining);
router.get('/students', getStudents);
router.get('/students/declaration', getDeclaration);


// api of put 
router.patch('/student/updateDiningFee/:id', updateDiningFee);
router.patch('/student/mealSwitch/:id', mealSwitch);
router.patch('/student/setPassword', setStudentLogin)


module.exports = router;