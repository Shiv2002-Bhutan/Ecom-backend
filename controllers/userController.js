import userModel from "../models/userModels.js";
import validator from "validator"
import  bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


//to create a token
const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try{
  const{email, password} =req.body

  const user = await userModel.findOne({email})
  if(!user){
    return res.json({success:false,message:"User doesn't exists"})
  }
  const isMatch = await bcrypt.compare(password,user.password)

  if(isMatch){
    const token = createToken(user._id)
    res.json({success:true, token})
  }else{
    res.json({success:false,message:"Enter a valid password"})
  }
}catch(error){
    res.json({success:false,message:"Error"})
}
};

const registerUser = async (req, res) => {
 try {
    const {name, email, password} = req.body
    //checking if user already exists
    const exists =  await userModel.findOne({email})
    if (exists) {
        return res.json({success:false, message:"User already exists"})
        
    }
    //validating email and strong password
    if(!validator.isEmail(email)){
         return res.json({success:false, message:"Please enter a valid email"})
    }
    if(password.length<8){
       return res.json({success:false, message:"Please enter a strong password"})
    }


    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    // creating  an account

    const newUser =new userModel({
        name,
        email,
        password:hashedPassword

    })

    const user = await newUser.save()

    const token = createToken(user._id)
    res.json({success:true, token})

    

 } catch (error) {
    res.json({success:false,message:"Error"})
    
 }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Generate JWT with a proper payload
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };