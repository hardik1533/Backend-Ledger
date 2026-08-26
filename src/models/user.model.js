const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating an User."],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: [true,"Email is already exist."],
    },
    name: {
        type: String,
        required: [true, "Name is required for creating an account."]
    },
    password: {
        type: String,
        required: [true, "Password is required for creating an accont."],
        minlength: [6, "password should contain more than 6 characters."],
        slect: false,
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
},{
    timestamps: true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next;
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return next;

})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;