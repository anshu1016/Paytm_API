const mongoose = require("mongoose");

const PaytmUserSchema = new mongoose.Schema({
  username:{
    type:String,
    trim:true,
    required:true,
    lowercase:true,
    minLength:3,
    maxLength:30
  },
  password:{
    type:String,
    required:true,
    minLength:6
  },
  firstName:{
    type:String,
    required:true,
    maxLength:50,
    trim:true
  },
  lastName:{
    type:String,
      required:true,
      maxLength:50,
      trim:true
  }
})

const accountSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'PaytmUser',
      required: true
  },
  balance: {
      type: Number,
      required: true
  }
});

const Account = mongoose.model('Account', accountSchema);



const PaytmUser = mongoose.model("PaytmUser",PaytmUserSchema)

module.exports = {PaytmUser,Account};