const jwt = require("jsonwebtoken");
const JWT_SECRET = "SHUKLA HI SECRET HAI"



const authMiddleware = async(req,res,next) => {
  try{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({})
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,JWT_SECRET);
    req.userId = decoded.userId;
    next();
    
  }
  catch(err){
    return res.status(403).json({err:err.message,message:"User has Entered wrong credentials"});
  }
}

module.exports = {authMiddleware};