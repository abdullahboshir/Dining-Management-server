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
console.log('got valueeeee', diningDiclaration)
  
    return diningDiclaration;
};


exports.getDeclarationService = async () => {


    // Create a date object for the current date and time in Bangladesh timezone
    const currentDateInBD = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    
    const currentDateObject = new Date(currentDateInBD);
    
    const humanReadable = {
        year: currentDateObject.getFullYear(),
        month: currentDateObject.getMonth() + 1, // Adding 1 because months are zero-based
        day: currentDateObject.getDate(),
        hour: currentDateObject.getHours(),
        minute: currentDateObject.getMinutes(),
        second: currentDateObject.getSeconds(),
        millisecond: currentDateObject.getMilliseconds(),
        bdFormattedDate: currentDateInBD,
    };
    
    console.log('Full Date in Bangladesh:', humanReadable);
    



    

    


    const getDeclaration = await DiningDeclaration.find({});
    console.log('this is failed', getDeclaration[0].createdAt)
    return getDeclaration;
};



// create Dining declaration
// exports.declarationService = async (declarationBody) => {
//     console.log('got valueeeee', declarationBody)

//     const diningDiclaration = await DiningDeclaration.updateMany({}, {
//         $set: {
//             'mealInfo.maintenanceCharge': declarationBody.maintenanceCharge,
//             'mealInfo.mealCharge': declarationBody.mealCharge,
//             'mealInfo.fixedMeal': declarationBody.fixedMealCharge,
//             'mealInfo.noticeBoard': declarationBody.noticeBoard,
//         }
//     });

//     return diningDiclaration;
// };


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


    const updatedMeal = existingStudent.mealInfo.totalMeal + parseInt(diningFeeBody.addMeal);
    const currentDepositCalculate = existingStudent.mealInfo.currentDeposit + parseInt(diningFeeBody.addMoney);
    const totalMeal = existingStudent.mealInfo.mealCharge * parseInt(diningFeeBody.addMeal);
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




    // setInterval(async () => {
    //     const student = await Student.findOne({ _id: studentId });
    //     const convertNumber = parseFloat(student.mealInfo.mealCharge);
    //     console.log('totallll', typeof(student.mealInfo.totalMeal))

    //     if (student) {
    //         student.mealInfo.totalMeal++; // Increment totalMeal
    //         const updatedResult = await Student.updateOne(
    //             { _id: studentId },
    //             { $set: { 
    //                 "mealInfo.totalMeal": student.mealInfo.totalMeal,
    //                 "mealInfo.totalCost": student.mealInfo.totalMeal * convertNumber,

    //         } }
    //         );
    //         console.log("Total meal updated:", updatedResult);
    //     } else {
    //         console.log("Student not found.");
    //     }
    // }, 5000); // 5000 milliseconds = 5 seconds



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
            'mealInfo.mealStutas': mealSwitchBody.mealSwitch
        }
    },
    { new: true }
    );

    return mealSwitch;
};