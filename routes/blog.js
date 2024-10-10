const express=require("express");
const Blog=require("../models/blogs");
const User=require("../models/user");
const multer=require('multer');
const path=require("path");
const Comment=require("../models/comment");

const router=express.Router();

// This is for uploading the file.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename= Date.now() + '-' +file.originalname;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.get("/add-new",(req,res)=>{
  return res.render("addBlog",{
    user:req.user,
  });
});

router.get("/:id",async(req,res)=>{
  const blog=await Blog.findById(req.params.id).populate('CreatedBy'); //populate??
  const comments=await Comment.find({BlogId:req.params.id}).populate('CreatedBy');
  console.log(blog);
  return res.render("blog",{
    user:req.user,
    blog,
    comments,
  })
});

router.post("/",upload.single('CoverImage'),async(req,res)=>{
  const {title,body}=req.body;
  console.log(req.body);
  console.log(req.file);
  const blog = await Blog.create({
   body,
   title,
   CreatedBy:req.user._id,
   coverImageURL:`/uploads/${req.file.filename}`,
  });
  return res.redirect(`/`);
});

router.post("/comment/:BlogId",async(req,res)=>{
   await Comment.create({
   content:req.body.content,
   BlogId:req.params.BlogId,
   CreatedBy:req.user._id,
  });
  return res.redirect(`/blog/${req.params.BlogId}`);
});

module.exports=router;