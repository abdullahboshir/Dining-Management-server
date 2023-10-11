const express = require('express');
const router = express.Router();
const { userLogin, loginCheck, userToken, diningCreate, getDining, studentCreate, getStudents, updateDiningFee, declarationCreate, mealSwitch, getDeclaration, setStudentLogin, getAdmin, verifyProfile } = require('../controllers/dining.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const authorization = require('../middlewares/authorization');


// created data
router.post('/student/login', userLogin);
router.post('/dining/add', diningCreate);
router.post('/students/declaration', declarationCreate);
router.post('/student/add', studentCreate);


//  api of all get
// router.get('/student/login', verifyToken, userLogin);
router.get('/dinings', verifyToken, authorization('admin', 'manager'), getDining);
router.get('/students', getStudents);
router.get('/students/declaration', getDeclaration);
router.get('/profileVerify', verifyToken, verifyProfile);
router.get('/admin/:emailOrNumber', verifyToken, authorization('admin', 'manager'), getAdmin);


// api of patch 
// router.patch('/student/userToken/:id', userToken);
router.patch('/student/updateDiningFee/:id', updateDiningFee);
router.patch('/student/mealSwitch/:id', mealSwitch);
router.patch('/student/setPassword', setStudentLogin)

// api of put
// router.put('/userToken/:emailOrNumber', loginCheck)


module.exports = router;