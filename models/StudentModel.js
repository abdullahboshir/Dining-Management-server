const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const validator = require('validator');



const studentSchema = new Schema({
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author'
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    diningId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dining'
      },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'manager'
    },
    studentId: {
        type: Number,
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
    studentPin: {
        type: String,
        index: true,
        trim: true,
        default: function () {
          // Generate a random 5-digit PIN as the default value
          return Math.floor(10000 + Math.random() * 90000).toString();
        },
        validate: {
          validator: function (value) {
            return /^[0-9]{5}$/.test(value);
          },
          message: 'The Student ID must contain exactly 5 numbers.'
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
        enum: ['active', 'inActive', 'blocked'],
        default: 'active'
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
    emailOrPhoneNumber: {
        type: String,
        index: { unique: true },
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email or Phone Number is required'],
        validate: {
            async validator(v) {
                const count = await mongoose.models.Student?.countDocuments({ emailOrPhoneNumber: v });
                if (count > 0) {
                    const existing = await mongoose.models.Student.findOne({ emailOrPhoneNumber: v });
                    if (!(existing._id.toString() === this._id.toString())) {
                        throw new Error("Email or Phone Number is not unique");
                    }
                }
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{5})$/.test(v);
            },
            message: props => `${props.value} is not a valide Email or Phone number`
        }
    },
    password: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'user', 'blocked'],
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
    mealInfo: {
        type: Schema.Types.Mixed,
        default: {},

      },
    createdAt: Date,
    updatedAt: Date
},
    { timestamps: true }
    
);



// Define a pre-save middleware to update mealInfo dynamically
studentSchema.pre('save', function (next) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = currentDate.toLocaleString('default', {month: 'long', locale: 'bn-BD'});

    // Initialize mealInfo if it doesn't exist
    if (!this.mealInfo) {
        this.mealInfo = {};
    }

    // Create or update the dynamic key based on the current year and month
    this.mealInfo[currentYear] = this.mealInfo[currentYear] || {};
    this.mealInfo[currentYear][currentMonth] = {
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
      refundable: 0,
    };
    next();
  });


//   compare login password 
  studentSchema.methods.comparePassword = function (password, hashedPassword){
    const isvalidPassword = bcrypt.compareSync(password, hashedPassword);
    return isvalidPassword;
  }



// const Student = mongoose.model('add_student', studentSchema);

module.exports = studentSchema;