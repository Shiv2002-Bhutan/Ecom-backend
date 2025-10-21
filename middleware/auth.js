import e from 'express'
import jwt from 'jsonwebtoken'

const authUser=(req,res,next)=>{

    const {token}= req.headers

    if(!token){
        return res.json({success:false,message:"Unauthorized"})
    }
    try {
        const decoded_token=jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId = decoded_token.id
        next()      
        
    } catch (error) {
        return res.json({success:false,message:error.message}) 
        
    }
}
export default authUser