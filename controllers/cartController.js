import userModel from "../models/userModels.js"

const addToCart = async(req,res)=>{

    try {
        const{userId,size,itemId}=req.body

        const userData = await userModel.findById(userId)
        let cartData=userData.cartData

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size]+=1
            }else{
                cartData[itemId][size]=1
            }
        }else{
            cartData[itemId]={[size]:1}
        }

        await userModel,findByIdAndUpdate(userId,{cartData})
        return res.json({success:true,message:"Added to cart"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

const updateCart=async(req,res)=>{
    
try {
    const{userId,size,itemId,quantity}=req.body
    const userData =await userModel.findById(userId)
    let cartData =userData.cartData
    cartData[itemId][size]=quantity

    await userModel.findByIdAndUpdate(userId,{cartData})
    return res.json({success:true,message:"Cart updated"})  
    
} catch (error) {
    res.json({success:false,message:error.message})
    
}
    
    

}

const getCart=async(req,res)=>{
try {
    const {userId}=req.body
    const userData = await userModel.findById(userId)
} catch (error) {
    res.json({success:false,message:error.message})                 
    
}
}

export {addToCart,updateCart,getCart}