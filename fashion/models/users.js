import mongoose from 'mongoose';

//Creating the userSchema
//Here trim is used to trim whitespace before and after input string
const userSchema = new mongoose.Schema({
    'name':{
        type: String,
        required: true,
        trim: true
    },

    'email':{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    'password':{
        type: String,
        required: true,
        select: false
    },
},{
    //Used for creating timestamps createdAt and updatedAt. Done automatically by mongo
    timestamps: true
});

//Making and exporting the Collection with name Users
export const Users = mongoose.model('Users',userSchema);