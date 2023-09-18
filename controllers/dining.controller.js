const { userLoginService, userToken,  diningCreateService, studentCreateService, getDiningService, getStudentService, updateDiningFeeService, getDeclarationService, declarationCreateService, mealSwitchService, studentLoginService } = require("../services/dining.service");
const { tokenGenerate } = require("../utils/authToken");





exports.userToken = async (req, res) => {
    try {
        
        const getUserToken = await 

        res.status(200).json({
            status: 'Successed',
            message: 'Successfully login the User',
            data: getUserToken
        })
    } catch (error) {
        res.status(400).json({
            status: 'Failed', 
            message: 'coutd not login the user',
            error: error.message
        })
    }
} 


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


exports.userLogin = async (req, res) => {
    try {
        const {emailOrPhoneNumber, password} = req.body;
        const user = await userLoginService(emailOrPhoneNumber);


        if(!user){
            return res.status(404).json({
                status: 'Failed',
                error: 'User not found, You are unregisterd'
            })
        };

        const isvalidPassword = user.comparePassword(password, user.password)

        if(!isvalidPassword){
            return res.status(401).json({
                status: 'Failed',
                error: 'Does not match your Credential'
            })
          };


          if(user.status != 'active'){
            return res.status(403).json({
                status: 'Failed',
                error: 'you are blocked'
            })
          };


          const token = tokenGenerate(user);

          const {password: pass, ...others} = user.toObject();


            res.status(200).json({
                status: 'success',
                message: 'successfully logged in',
                data: {
                    user: others, token
                }
            });
        
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "couldn'd get the job",
            error: error.message
        })
    }
}