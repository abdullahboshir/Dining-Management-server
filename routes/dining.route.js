const express = require('express');
const router = express.Router();
const { userLogin, loginCheck, userToken, diningCreate, getDining, studentCreate, getStudents, updateDiningFee, declarationCreate, mealSwitch, getDeclaration, setStudentLogin } = require('../controllers/dining.controller');
const { verifyToken } = require('../middlewares/verifyToken');


// created data
router.post('/student/login', userLogin);
router.post('/dining/add', diningCreate);
router.post('/students/declaration', declarationCreate);
router.post('/student/add', studentCreate);


//  api of all get
// router.get('/student/login', verifyToken, userLogin);
router.get('/dinings', getDining);
router.get('/students', getStudents);
router.get('/students/declaration', getDeclaration);


// api of patch 
// router.patch('/student/userToken/:id', userToken);
router.patch('/student/updateDiningFee/:id', updateDiningFee);
router.patch('/student/mealSwitch/:id', mealSwitch);
router.patch('/student/setPassword', setStudentLogin)

// api of put
// router.put('/userToken/:emailOrNumber', loginCheck)


module.exports = router;