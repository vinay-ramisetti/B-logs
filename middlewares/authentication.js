const {validateToken}=require("../service/authentication")

function CheckForAuthentication(cookieName){
  return (req,res,next)=>{
    const tokenCookievalue=req.cookies[cookieName];
    if(!tokenCookievalue) {
      return next();
    }

    try{
      const userpayload=validateToken(tokenCookievalue);
      req.user=userpayload;
    }
    catch(error){}

    return next();
  }
}

module.exports={
  CheckForAuthentication,
}