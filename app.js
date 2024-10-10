require('dotenv').config()

const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const {CheckForAuthentication}=require("./middlewares/authentication");
const Blog=require("./models/blogs");

const app=express();
const port=process.env.PORT || 8000;  // cloud provider gives the port value

app.set('view engine','ejs');
app.set("views",path.resolve("./views"));

mongoose.connect(process.env.MONGO_URL)   // cloud provider gives the mongodb url
.then((e)=>console.log("Mongodb Connected"));

app.use(express.urlencoded({extended:false})); // imp.
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));  // this middleware is for images. making the images in that folder static
app.use(CheckForAuthentication("token"));

const userRoute=require("./routes/user");
const BlogRoute=require("./routes/blog");

app.get("/",async(req,res)=>{
  const allBlogs=await Blog.find({});
  res.render('home',{
    user:req.user,
    blogs:allBlogs,
  });
})
app.get("/user/logout",(req,res)=>{
  return res.clearCookie("token").redirect("/");
})

app.use("/user",userRoute); // routes starting with /user.
app.use("/blog",BlogRoute);


app.listen(port,()=>console.log(`Succesfully launched at port:${port}`));