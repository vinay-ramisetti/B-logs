const {Schema, model}=require("mongoose");

const CommentSchema= new Schema({
  content:{
    type:String,
    required:true,
  },
  BlogId:{
    type:Schema.Types.ObjectId,
    ref:"blog",
  },
  CreatedBy:{
    type:Schema.Types.ObjectId,
    ref:"user",
  },
},{timestamps:true});

const Comment=model("comment",CommentSchema);

module.exports=Comment;