const mongoose = require('mongoose');



// A reusable function to generate the date object
function generateDateObject() {
    const currentDate = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'Asia/Dhaka', // Set the timezone to Bangladesh
    };
    const formattedDate = currentDate.toLocaleString('en-BD', options);

    return {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
        hour: currentDate.getHours(),
        minute: currentDate.getMinutes(),
        second: currentDate.getSeconds(),
        miliSecound: currentDate.getMilliseconds(),
        bdFormattedDate: formattedDate,
    };
};



const DeclarationSchema = new mongoose.Schema({
    authorId: {
        type: String,
        trim: true,
        default: 'author1'
    },
    diningId: {
        type: String,
        trim: true,
        default: 'nazrulHall'
    },
    maintenanceCharge: {
        type: Number,
        trim: true
    },
    mealCharge: {
        type: String,
        trim: true
    },
    fixedMealCharge: {
        type: Number,
        trim: true
    },
    noticeBoard: {
        type: String
    },
    createdAt: {
        type: Object, // Store as an object
        default: () => {
            const currentDate = new Date();
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZone: 'Asia/Dhaka',
                hour12: true
            };
            const formattedDate = currentDate.toLocaleString('en-BD', options);
            
            return {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1,
                day: currentDate.getDate(),
                hour: currentDate.getHours(),
                minute: currentDate.getMinutes(),
                second: currentDate.getSeconds(),
                miliSecound: currentDate.getMilliseconds(),
                bdFormattedDate: formattedDate
            };
        }
    },
      updatedAt: {
        type: Object,
      }
},
    { timestamps: true }
);


// Define a pre-save middleware to update updatedAt with createdAt
DeclarationSchema.pre('save', function (next) {
    this.updatedAt = this.createdAt;
    next();
});




const Declaration = mongoose.model('add_declaration', DeclarationSchema);


module.exports = Declaration;



