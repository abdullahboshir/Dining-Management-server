const { default: mongoose } = require("mongoose");
const DiningDeclaration = require("../models/DiningDeclaration");
const Dining = require("../models/DiningModel");
const studentSchema = require("../models/StudentModel");
// const Student = require("../models/StudentModel");
const bcrypt = require('bcryptjs');
const getDbCollectionName = require("../server");



const modelDriver = modelName => {
  return mongoose.model(modelName, studentSchema)
};




// Dining Activities------------------ 

// create a new Dining
exports.diningCreateService = async (diningInfo) => {
  const dining = await Dining.create(diningInfo);
  return dining;
};


// create Dining declaration
exports.declarationCreateService = async (declarationBody) => {
  const diningDiclaration = await DiningDeclaration.create(declarationBody);

  return diningDiclaration;
};


exports.getDeclarationService = async () => {
  const getDeclaration = await DiningDeclaration.findOne({}).sort({ "_id": -1 });
  return getDeclaration;
};

exports.getDiningService = async () => {
  const dining = await Dining.find({});
  return dining;
};


exports.studentCreateService = async (studentBody) => {

  console.log('existing Dine', studentBody.diningId)
  const existingDining = await Dining.findOne({_id : studentBody?.diningId});
  const diningName = existingDining?.diningName?.replace(/ /g, '_');

  const Student = modelDriver(existingDining?.diningName && diningName + '_Students')
  const student = await Student.create(studentBody);
  return student;
};


exports.getStudentService = async (diningId) => {
  const existingDining = await Dining.findOne({_id : diningId});
  const diningName = existingDining?.diningName?.replace(/ /g, '_');
  const Student = modelDriver(existingDining?.diningName && diningName + '_Students')
  // console.log('studenttttttttttt', existingDining?.diningName && diningName + '_Students')
  
  
  const studentData = await Student.find({});

  return studentData;
};




exports.updateDiningFeeService = async (studentId, diningFeeBody) => {
  const existingDining = await Dining.findOne({_id : diningFeeBody?.diningId});
  const diningName = existingDining?.diningName?.replace(/ /g, '_');
  const Student = modelDriver(existingDining?.diningName && diningName + '_Students')

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', locale: 'bn-BD' });


  const mealChargeDeclaration = await DiningDeclaration.findOne({}).sort({ "_id": -1 });
  const existingStudent = await Student.findOne({ _id: studentId });




  const updatedMeal = existingStudent.mealInfo[currentYear][currentMonth].totalMeal + parseInt(diningFeeBody.addMeal);
  const currentDepositCalculate = existingStudent.mealInfo[currentYear][currentMonth].currentDeposit + parseInt(diningFeeBody.addMoney);
  const totalMeal = parseInt(mealChargeDeclaration.mealCharge) * parseInt(diningFeeBody.addMeal);
  const totalCost = existingStudent.mealInfo[currentYear][currentMonth].totalCost + totalMeal;
  const currentDeposit = currentDepositCalculate - totalMeal;
  const updatedTotalDeposit = existingStudent.mealInfo[currentYear][currentMonth].totalDeposit + parseInt(diningFeeBody.addMoney);



  const studentDiningFee = await Student.findByIdAndUpdate(
    studentId,
    {
      $set: {
        [`mealInfo.${currentYear}.${currentMonth}.maintenanceFee`]: diningFeeBody.maintenanceFee,
        [`mealInfo.${currentYear}.${currentMonth}.totalMeal`]: updatedMeal,
        [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]: currentDeposit,
        [`mealInfo.${currentYear}.${currentMonth}.totalCost`]: totalCost,
        [`mealInfo.${currentYear}.${currentMonth}.totalDeposit`]: updatedTotalDeposit

      }
    },
    { new: true }
  );

  if (!studentDiningFee) {
    throw new Error('Student not fount')
  };
  return studentDiningFee;
};





exports.mealSwitchService = async (studentId, mealSwitchBody) => {

  const existingDining = await Dining.findOne({_id : mealSwitchBody?.diningId});
  const diningName = existingDining?.diningName?.replace(/ /g, '_');
  const Student = modelDriver(existingDining?.diningName && diningName + '_Students')

  // const Student = modelDriver('add_student')
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', locale: 'bn-BD' });

  const mealChargeDeclaration = await DiningDeclaration.findOne({}).sort({ "_id": -1 });
  const existingStudent = await Student.findById(studentId);


  const mealSwitch = await Student.findByIdAndUpdate(
    studentId,
    {
      $set: {
        [`mealInfo.${currentYear}.${currentMonth}.mealStatus`]: mealSwitchBody.mealSwitch,
      }
    },
    { new: true }
  );

  if (!mealSwitch) {
    throw new Error(`Student with ID ${studentId} not found`);
  }


  if (mealSwitch.mealInfo[currentYear][currentMonth].mealStatus === 'on') {
    let totalMealIncreaseInterval = setInterval(async () => {
      try {

        const latestMealSwitch = await Student.findById(studentId);

        if (latestMealSwitch.mealInfo[currentYear][currentMonth].mealStatus === 'off') {
          clearInterval(totalMealIncreaseInterval);
          console.log('Interval stopped because mealStatus is off');
          return;
        }

        const increasing = 1;
        existingStudent.mealInfo[currentYear][currentMonth].totalMeal += increasing;
        const multiplyMeal = parseInt(mealChargeDeclaration.mealCharge) * increasing;
        const totalCost = existingStudent.mealInfo[currentYear][currentMonth].totalCost += multiplyMeal;
        const currentDeposit = existingStudent.mealInfo[currentYear][currentMonth].currentDeposit -= multiplyMeal;

        if (latestMealSwitch.mealInfo[currentYear][currentMonth].currentDeposit <= 100) {
          clearInterval(totalMealIncreaseInterval);
          await Student.findByIdAndUpdate(
            studentId,
            {
              $set: {
                [`mealInfo.${currentYear}.${currentMonth}.mealStatus`]: 'off',
              },
            }
          );
          console.log('Interval stopped because currentDeposit is below 100');
          return;
        }


        // Update totalCost and currentDeposit
        await Student.findByIdAndUpdate(
          studentId,
          {
            $set: {
              [`mealInfo.${currentYear}.${currentMonth}.totalMeal`]: existingStudent.mealInfo[currentYear][currentMonth].totalMeal,
              [`mealInfo.${currentYear}.${currentMonth}.totalCost`]: totalCost,
              [`mealInfo.${currentYear}.${currentMonth}.currentDeposit`]: currentDeposit,
            },
          }
        );
      }
      catch (error) {
        console.error('Error updating totalMeal:', error);
        clearInterval(totalMealIncreaseInterval);
      }
    }, 2000);
  }

  return mealSwitch;
};






exports.updateMealInfoData = async () => {
  try {

    setInterval(async () => {

         // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
   const currentMonth = currentDate.toLocaleString('default', { month: 'long', locale: 'bn-BD' });
      

      const collections = await mongoose.connection.db.collections();
      const studentCollections = collections.filter((collection) => {return collection.collectionName.includes('student')})
      const Student = studentCollections.map(async(collection) => {
        const Student = modelDriver(collection.collectionName);


     
    // Check if the current year exists in any student's mealInfo
    const yearExist = await Student.exists({
      [`mealInfo.${currentYear}`]: { $exists: true }
    });

    // Check if the current month exists in any student's mealInfo
    const monthExists = await Student.exists({
      [`mealInfo.${currentYear}.${currentMonth}`]: { $exists: true } 
    });


    if (!monthExists) {
      const studentMealInfo = {
        mealStatus: 'off',
        maintenanceFee: 0,
        totalDeposit: 0,
        currentDeposit: 0,
        lastMonthRefund: 0,
        lastMonthDue: 0,
        totalMeal: 0,
        mealCharge: 0,
        fixedMeal: 0,
        fixedMealCharge: 0,
        totalCost: 0,
        dueDeposite: 0,
        refundable: 0
      };

      const result = await Student.updateMany(
        {},
        { $set: { [`mealInfo.${currentYear}.${currentMonth}`]: studentMealInfo } }
      ).catch(error => {
        console.log('Update error', error.message)
      })

      console.log(`Added ${currentMonth} to mealInfo.2023 for ${result} students.`);
    } else {
      console.log(`${currentMonth} already exists in mealInfo.2023. No update needed.`);
    }

      });


    }, 24 * 60 * 60 * 2000);
  

  } catch (error) {
    console.error('Error:', error);
  }
}
// setInterval(updateMealInfoData, 24 * 60 * 60 * 1000);




exports.studentLoginService = async (loginInfoBody) => {
  try {
  
    let finddiningId;
    const allUsers = []; // Array to store all users
    
    const collections = await mongoose.connection.db.collections();
    const studentCollections = collections
      .filter((collection) => collection.collectionName.includes('student'));
    for (const collection of studentCollections) {
      finddiningId = modelDriver(collection.collectionName);
      const usersInCollection = await finddiningId.find({}); // Retrieve all users in the collection
      allUsers.push(...usersInCollection); // Add users to the allUsers array
    }
    

    const findUser =  allUsers.find(user => user.emailOrPhoneNumber === loginInfoBody?.emailOrPhoneNumber );
    if (!findUser) {
      return 'User not found';
    }
    // console.log('All users from student collections:', findUser);
    const existingDining = await Dining.findOne({_id : findUser?.diningId});
    const diningName = existingDining?.diningName?.replace(/ /g, '_');
    const Student = modelDriver(existingDining?.diningName && diningName + '_Students')
    
    
    if (!findUser) {
      return 'User not found'
    } 
    

    if (findUser.password) {
      console.log('password already seted')
      return 'Password already has seted before';
    };
    
    
    if (findUser.password === "") {
      const pinMatching = loginInfoBody.studentPin === findUser.studentPin;
     
      if (!pinMatching) {
        return {pinNotMatch : 'PIN is not match'};
      } else if (pinMatching === true) {


        const hashedPassword = bcrypt.hashSync(loginInfoBody.password, 10);

        // const hashPassword = passEncrypt(loginInfoBody.password);
        // console.log('this pass is created ', hashPassword)
        

        const document = await Student.updateOne(
          { _id: findUser._id },
          { $set: { password: hashedPassword } }
        );
        return document;
      };
    }; 
    
    return findUser;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


exports.userLoginService = async (emailOrPhoneNumber) => {
  
  let finddiningId;
    const allUsers = []; // Array to store all users
    
    const collections = await mongoose.connection.db.collections();
    const studentCollections = collections
      .filter((collection) => collection.collectionName.includes('student'));
    for (const collection of studentCollections) {
      finddiningId = modelDriver(collection.collectionName);
      const usersInCollection = await finddiningId.find({}); // Retrieve all users in the collection
      allUsers.push(...usersInCollection); // Add users to the allUsers array
    }
    
    console.log('All users from student collections:', allUsers.length);
    const findUser =  allUsers.find(user => user.emailOrPhoneNumber === emailOrPhoneNumber );
    
    if (!findUser) {
      return 'User not found';
    }
    
    const existingDining = await Dining.findOne({_id : findUser?.diningId});
    const diningName = existingDining?.diningName?.replace(/ /g, '_');
    const Student = modelDriver(existingDining?.diningName && diningName + '_Students')
    
    const getLoginUser = await Student.findOne({emailOrPhoneNumber})

    
    if (!getLoginUser) {
      return 'User not found'
    } 

  return getLoginUser;
};


exports.getAdminService = async (emailOrPhoneNumber) => {
  let finddiningId;
  const allUsers = [];
  
  const collections = await mongoose.connection.db.collections();
  const studentCollections = collections
    .filter((collection) => collection.collectionName.includes('student'));
  for (const collection of studentCollections) {
    finddiningId = modelDriver(collection.collectionName);
    const usersInCollection = await finddiningId.find({}); // Retrieve all users in the collection
    allUsers.push(...usersInCollection); // Add users to the allUsers array
  }
  
  console.log('All users from student collections:', allUsers.length);
  const findUser =  allUsers.find(user => user.emailOrPhoneNumber === emailOrPhoneNumber?.emailOrNumber );

  if (!findUser) {
    return 'User not found';
  }
  
  const existingDining = await Dining.findOne({_id : findUser?.diningId});
  const diningName = existingDining?.diningName?.replace(/ /g, '_');
  const Student = modelDriver(existingDining?.diningName && diningName + '_Students')
  
  const getLoginUser = await Student.findOne({emailOrPhoneNumber: emailOrPhoneNumber?.emailOrNumber})
  return getLoginUser
};


exports.userProfileService = async (emailOrPhoneNumber) => {
  let finddiningId;
    const allUsers = []; // Array to store all users
    
    const collections = await mongoose.connection.db.collections();
    const studentCollections = collections
      .filter((collection) => collection.collectionName.includes('student'));
    for (const collection of studentCollections) {
      finddiningId = modelDriver(collection.collectionName);
      const usersInCollection = await finddiningId.find({}); // Retrieve all users in the collection
      allUsers.push(...usersInCollection); // Add users to the allUsers array
    }
    
    const findUser =  allUsers.find(user => user.emailOrPhoneNumber === emailOrPhoneNumber );
    

    if (!findUser) {
      return 'User not found';
    }
    
    const existingDining = await Dining.findOne({_id : findUser?.diningId});
    const diningName = existingDining?.diningName?.replace(/ /g, '_');
    const Student = modelDriver(existingDining?.diningName && diningName + '_Students')
    
    const existingUser = await Student.findOne({emailOrPhoneNumber});
return existingUser;
};