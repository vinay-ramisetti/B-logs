const express=require("express");
const User=require("../models/user");
const cookie=require("cookie");

const router=express.Router();


router.get("/signin",(req,res)=>{
  res.render("signin");
});

router.get("/signup",(req,res)=>{
  res.render("signup");
});

router.post("/signup",async(req,res)=>{
  const {fullname,email,password}=req.body;
  await User.create({
   fullname,
   email,
   password
  });
  return res.redirect("/");
})

router.post("/signin",async(req,res)=>{
  const {email,password}=req.body;
  try{
    const token= await User.matchPasswordAndGenerateToken(email,password);
    res.cookie("token",token); 
    return res.redirect("/");
  }
  catch(error){
    return res.render("signin",{
      error:"Incorrect Email or Password",
    });
  }
});



module.exports=router;