const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const validator = require('validator');

const diningSchema = new Schema({
    diningName: {
        type: String,
        required: [true, 'Please provide a Name'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [100, 'Name is too large']
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
    seatsNumber: {
        type: Number,
        required: [true, 'Seats is required']
    },
    emailOrPhoneNumber: {
        type: String,
        index: { unique: true, dropDups: true },
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email is required',
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{5})$/.test(v);
            },
            message: props => `${props.value} is not a valide Email or Phone number`
        }
    },
    password: {
        type: String,
        validate: {
            validator: (value) =>
                validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                }),
            message: 'Password {VALUE} is not storong enough'
        }
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Password doesn\'t match'
        }
    },
    applicationDateStart: String,
    applicationDateEnd: String,
    applicationDate: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
    { timestamps: true }
);

diningSchema.pre('save', function(next) {
    const password = this.password;
    const hashedPassword = bcrypt.hashSync(password);

    this.password = hashedPassword;
    this.confirmPassword = undefined

    next()
});

diningSchema.methods.comparePassword = function(password, hash){
    const isPasswordValid = bcrypt.compareSync(password, hash);
    return isPasswordValid;
};


const Dining = mongoose.model('Add_dining', diningSchema);

module.exports = Dining;
