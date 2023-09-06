const DiningDeclaration = require("../models/DiningDeclaration");
const Dining = require("../models/DiningModel");
const Student = require("../models/StudentModel");





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



exports.studentCreateService = async (studentBody) => {
    const student = await Student.create(studentBody);
    return student;
};

exports.getDiningService = async () => {
    const dining = await Dining.find({});
    return dining;
};

exports.getStudentService = async () => {
    const studentData = await Student.find({});
    return studentData;
};



exports.updateDiningFeeService = async (studentId, diningFeeBody) => {
    const existingStudent = await Student.findOne({ _id: studentId });
    const mealChargeDeclaration = await DiningDeclaration.findOne({}).sort({ "_id": -1 });



    const updatedMeal = existingStudent.mealInfo.totalMeal + parseInt(diningFeeBody.addMeal);
    const currentDepositCalculate = existingStudent.mealInfo.currentDeposit + parseInt(diningFeeBody.addMoney);
    const totalMeal = mealChargeDeclaration.mealCharge * parseInt(diningFeeBody.addMeal);
    const totalCost = existingStudent.mealInfo.totalCost + totalMeal;
    const currentDeposit = currentDepositCalculate - totalMeal;
    const updatedTotalDeposit = existingStudent.mealInfo.totalDeposit +  parseInt(diningFeeBody.addMoney);


    // console.log('cjjjjjjj', currentDepositCalculate)

    const studentDiningFee = await Student.findByIdAndUpdate(
        studentId,
        {
            $set: {
                'maintenanceFee.fee2023.january': diningFeeBody.maintenanceFee,
                'mealInfo.totalMeal': updatedMeal,
                'mealInfo.currentDeposit': currentDeposit,
                'mealInfo.totalCost': totalCost,
                'mealInfo.totalDeposit': updatedTotalDeposit

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
    

    const mealSwitch = await Student.findByIdAndUpdate(
        studentId, 
       { 
        $set: {
            'mealInfo.mealStatus': mealSwitchBody.mealSwitch,
        }
    },
    { new: true }
    );


    const mealChargeDeclaration = await DiningDeclaration.findOne({}).sort({ "_id": -1 });
    const existingStudent = await Student.findById(studentId);

    if (mealSwitch.mealInfo.mealStatus === 'on') {
     
        let totalMealIncreaseInterval = setInterval(async () => {
          try {

            const latestMealSwitch = await Student.findById(studentId);

         
            if (latestMealSwitch.mealInfo.mealStatus === 'off') {
              clearInterval(totalMealIncreaseInterval);
              console.log('Interval stopped because mealStatus is off');
              return;
            }

                const increasing = 1;
                existingStudent.mealInfo.totalMeal += increasing;
                await existingStudent.save();

        //    console.log('testtttttttttttttttt', increasing)

            const multiplyMeal =   mealChargeDeclaration.mealCharge * increasing;
            const totalCost =   existingStudent.mealInfo.totalCost += multiplyMeal;

            const currentDeposit = existingStudent.mealInfo.currentDeposit -= multiplyMeal;

            if (latestMealSwitch.mealInfo.currentDeposit <= 100) {
                await Student.findByIdAndUpdate(
                    studentId,
                    {
                      $set: {
                        'mealInfo.mealStatus': 'off',
                      },
                    }
                  );
                  return;
              }


            await Student.findByIdAndUpdate(
              studentId,
              {
                $set: {
                  'mealInfo.totalCost': totalCost,
                  'mealInfo.currentDeposit': currentDeposit
                },
              }
            );
        
          } catch (error) {
            console.error('Error updating totalMeal:', error);
            clearInterval(totalMealIncreaseInterval);
          }
        }, 2000);

        console.log('increasinggggggg', totalMealIncreaseInterval)
      }

    return mealSwitch;
};






async function updateMealInfoData() {
  try {

    // Get the current date and month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long', locale: 'bn-BD' });

    // Check if the current month exists in any student's mealInfo
    const monthExists = await Student.exists({
      [`mealInfo.${currentYear}.${'november'}`]: { $exists: true }
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
        { $set: { [`mealInfo.${currentYear}.${'november'}`]: studentMealInfo } }
      );

      console.log(`Added ${'november'} to mealInfo.2023 for ${result} students.`);
    } else {
      console.log(`${'november'} already exists in mealInfo.2023. No update needed.`);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// setInterval(updateMealInfoData, 24 * 60 * 60 * 1000);
