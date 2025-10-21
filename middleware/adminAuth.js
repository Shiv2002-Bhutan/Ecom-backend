import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {

      return res.status(401).json({ success: false, message: "Not Authorized. Please login." });
    }
   
   
    
    

   
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    
   
    if (decodedPayload.email !== process.env.ADMIN_EMAIL) {
     
      return res.status(403).json({ success: false, message: "Invalid Credentials. Admin access required." });
    }

   
    next();

  } catch (error) {

    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ success: false, message: "Authorization failed. Token is invalid or expired." });
  }
};

export default adminAuth;