const { getUserService, diningCreateService, studentCreateService, getDiningService, getStudentService, updateDiningFeeService, getDeclarationService, declarationCreateService, mealSwitchService, studentLoginService } = require("../services/dining.service");



exports.diningCreate = async (req, res) => {
    try {
        const diningbody = req.body;
        const diningInfo = await diningCreateService(diningbody);

        res.status(200).json({
            status: 'success',
            message: 'successfully created the new account',
            data: diningInfo
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "couln'd create the account",
            error: error.message
        })
    }
};


exports.getDining = async (req, res) => {
    try {
        const allDining = await getDiningService();

        res.status(200).json({
            status: 'success',
            message: 'successfully get the job',
            data: allDining
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "couldn'd get the job",
            error: error.message
        })
    }
};



exports.studentCreate = async (req, res) => {
    try {
        const studentBody = req.body;
        const createdStudent = await studentCreateService(studentBody);
        console.log('tassssssss', createdStudent)

        res.status(200).json({
            status: 'success',
            message: 'successfully created the new account',
            data: createdStudent
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "couln'd create the account",
            error: error.message
        }),
        console.log(error.message)
    }
};


exports.getStudents = async (req, res) => {
    try {
        const students = await getStudentService();

        res.status(200).json({
            status: 'success',
            message: 'successfully get the job',
            data: students
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "couldn'd get the job",
            error: error.message
        })
    }
};


exports.updateDiningFee = async (req, res) => {
  try {
    const studentId = req.params.id;
    const diningFeeBody = req.body;
    const studentFind = await updateDiningFeeService(studentId, diningFeeBody)

    console.log('5555555555', studentFind)
    res.status(200).json({
        status: 'success',
        message: 'successfully get the job',
        data: studentFind
    })
  } catch (error) {
    console.log('444444444', error.message)
        res.status(400).json({
            status: 'failed',
            message: "couldn'd get the job",
            error: error.message
        })
  }
};



exports.declarationCreate = async (req, res) => {
    try {
        
        const declarationBody = req.body;

        const declarationRes = await declarationCreateService(declarationBody);
        console.log('rrrrrrrrrr', declarationRes)

        res.status(200).json({
            status: 'success',
            message: 'successfully get the job',
            data: declarationRes
        })
    } catch (error) {
        console.log('got valueeeee', error)
        res.status(400).json({
            status: 'failed',
            message: "couldn'd get the job",
            error: error.message
        })
    }
};




exports.getDeclaration = async (req, res) => {
    try {
        const diningDeclaration = await getDeclarationService();
    
        res.status(200).json({
            status: 'success',
            message: 'successfully get the job',
            data: diningDeclaration
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "couldn'd get the job",
            error: error.message
        })
    }
};



exports.mealSwitch = async (req, res) => {
   try {
    const studentId = req.params.id;
    const switchCommand = await mealSwitchService(studentId, req.body);
   } catch (error) {
    
   }
};


exports.setStudentLogin = async (req, res) => {
try {
    const resLoginInfo = await studentLoginService(req.body);
    console.log('this is gottttttt', resLoginInfo) 

    res.status(200).json({
        status: 'success',
        message: 'successfully get the job',
        data: resLoginInfo

    })
} catch (error) {
    res.status(400).json({
        status: 'failed',
        message: "couldn'd get the job",
        error: error.message
    })
}
};


exports.getLoginUser = async (req, res) => {
    try {
        console.log('tserrrrrrrrrrrrr')
        const getUser = await getUserService(req.body);

        res.status(200).json({
            status: 'success',
            message: 'successfully get the job',
            data: getUser
        })
        
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "couldn'd get the job",
            error: error.message
        })
    }
}