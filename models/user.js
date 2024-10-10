const {Schema, model}=require("mongoose");
const {createHmac , randomBytes} = require('crypto');  // packages for hashing.
const {CreateTokenForUser}=require('../service/authentication');

const UserSchema= new Schema({
  fullname:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  salt:{   // it is for hashing the password.
    type:String
  },
  password:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    enum:['USER','ADMIN'],
    default:'USER',
  },
  profileImageURL:{
    type:String,
    default:"/images/default.png",
  }
},{timestamps:true});

// hashing is used to secure the passwords from the hacker incase database got leaked.
// we can't see the original password instead a long number is designed.


// creating the hash password for the user.
UserSchema.pre('save',function(next){
  const user=this; // this is a pointer , pointing just saved user.

  if(!user.isModified("password")) return;

  const salt=randomBytes(16).toString();
  const hashedPassword=createHmac('sha256',salt).update(user.password).digest("hex");
  this.salt=salt;
  this.password=hashedPassword;

  next();

});

//checking the signin user's password .
UserSchema.static("matchPasswordAndGenerateToken",async function (email,password) {
  const user=await User.findOne({email});
  if(!user) throw new Error("User not found");

  const salt=user.salt;
  const hashedPassword=user.password;
  
  const userProvidedhasing=createHmac("sha256",salt).update(password).digest("hex");

  if(userProvidedhasing!==hashedPassword) 
    throw new Error("Incorrect Password");

  const token=CreateTokenForUser(user);
  console.log(token);
  return token;
});



const User=model("user",UserSchema);

module.exports=User;