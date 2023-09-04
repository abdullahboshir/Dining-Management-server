const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const studentSchema = new Schema({
    studentId: {
        type: String,
        index: true,
        required: [true, 'Please provide a Student ID'],
        trim: true,
        validate: {
            validator: function (value) {
                return /^[0-9]{5}$/.test(value);
            },
            message: 'The array must contain exactly 5 numbers.'
        }
    },
    name: {
        type: String,
        required: [true, 'Please provide a Student Name'],
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        default: 'Male'
    },
    roomNumber: {
        type: Number,
        required: [true, 'Room Number is required'],
        validate: {
            validator: function (value) {
                return /^[0-9]{3}$/.test(value)
            },
            message: 'The array must contain exactly 3 numbers.'
        }
    },
    session: {
        type: String,
        required: [true, 'Please provide a Session of Student'],
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'Active'
    },
    department: {
        type: String,
        required: [true, 'Please provide a Department of Student'],
        trim: true
    },
    admissionFee: {
        type: Number,
        required: [true, 'Please provide a fee of Student'],
        trim: true
    },
    emailOrNumber: {
        type: String,
        index: { unique: true },
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email or Phone Number is required'],
        validate: {
          async validator(v) {
                const count = await mongoose.models.Student?.countDocuments({emailOrNumber: v});
            if (count > 0) {
                const existing = await  mongoose.models.Student.findOne({emailOrNumber: v});
                if (!(existing._id.toString() === this._id.toString())) {
                    throw new Error("Email or Number is not unique");
                }
            }
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{5})$/.test(v);
            },
            message: props => `${props.value} is not a valide Email or Phone number`
        }
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'user'],
        default: 'user'
    },
address: {
    father: {
        type: String,
        required: [true, 'Please provide your Father name'],
        trim: true
    },
    mother: {
        type: String,
        required: [true, 'Please provide your Mother name'],
        trim: true
    },
    divisionValue: {
        type: String,
        required: [true, 'Division is required']
    },
    districtValue: {
        type: String,
        required: [true, 'District is required']
    },
    subDistrictValue: {
        type: String,
        required: [true, 'Sub-district is required']
    },
    allianceValue: {
        type: String,
        required: [true, 'Alliance is required']
    },
    village: {
        type: String,
        required: [true, 'Please provide your Village name'],
        trim: true
    }
},
mealInfo:{
    mealStatus: {type: String, enum: ['off', 'on'], default: 'off'},
    totalDeposit: { type: Number, default: 0 },
    currentDeposit: { type: Number, default: 0 },
    lastMonthRefund: { type: Number, default: 0 },
    lastMonthDue: { type: Number, default: 0 },
    totalMeal: { type: Number, default: 0 },
    mealCharge: { type: String, default: 0 },
    fixedMeal: { type: Number, default: 0 },
    fixedMealCharge: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    refundable: { type: Number, default: 0 }
},
maintenanceFee: {
    fee2023: {
        january: { type: Number, default: 0 },
        february: { type: Number, default: 0 },
        april: { type: Number, default: 0 },
        march: { type: Number, default: 0 },
        may: { type: Number, default: 0 },
        jun: { type: Number, default: 0 },
        july: { type: Number, default: 0 },
        august: { type: Number, default: 0 },
        september: { type: Number, default: 0 },
        october: { type: Number, default: 0 },
        november: { type: Number, default: 0 },
        december: { type: Number, default: 0 }
    },
    fee2024: {
        january: { type: Number, default: 0 },
        february: { type: Number, default: 0 },
        march: { type: Number, default: 0 },
        april: { type: Number, default: 0 },
        may: { type: Number, default: 0 },
        jun: { type: Number, default: 0 },
        july: { type: Number, default: 0 },
        august: { type: Number, default: 0 },
        september: { type: Number, default: 0 },
        october: { type: Number, default: 0 },
        november: { type: Number, default: 0 },
        december: { type: Number, default: 0 }
    },
    fee2025: {
        january: { type: Number, default: 0 },
        february: { type: Number, default: 0 },
        march: { type: Number, default: 0 },
        april: { type: Number, default: 0 },
        may: { type: Number, default: 0 },
        jun: { type: Number, default: 0 },
        july: { type: Number, default: 0 },
        august: { type: Number, default: 0 },
        september: { type: Number, default: 0 },
        october: { type: Number, default: 0 },
        november: { type: Number, default: 0 },
        december: { type: Number, default: 0 }
    }
},
    createdAt: Date,
    updatedAt: Date
},
    { timestamps: true }
);



const Student = mongoose.model('add_student', studentSchema);

module.exports = Student;