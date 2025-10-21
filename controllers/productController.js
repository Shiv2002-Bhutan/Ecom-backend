import {v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModels.js';
import uploadToCloudinary from '../utils/cloudinaryUpload.js';

const addProduct =async(req,res)=>{

    try{
    const {name,sizes,category,subCategory,description,price,bestseller}=req.body;
    const image1=req.files.image1 && req.files.image1[0]
    const image2=req.files.image2 && req.files.image2[0]
    const image3=req.files.image3 && req.files.image3[0]
    const image4=req.files.image4 && req.files.image4[0]

    const images=[image1,image2,image3,image4].filter((item=>item!==undefined))

    let imageURL =await Promise.all(
        images.map(async(item)=>{
            let result= await uploadToCloudinary(item.buffer)
            return result.secure_url
        })
    )
   const productData = {
    name,
    description,
    category,
    subCategory,
    price:Number(price),
    bestseller :bestseller=== "false" ? false : true,
    size:JSON.parse(sizes),
    image:imageURL,
    date:Date.now()
   }
    
    const product = new productModel(productData)
    await product.save()
    
    
    

    res.json({success:true,message:"Product Added"})
    }catch(error){
        console.log("error");
        
      
        res.json({success:false,message:error.message})
        console.log(error.message)
    }
}
const removeProduct =async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product is deleted"})
    }catch(err){
        res.json({success:false,message:err.message})
    }

}
const listProduct =async(req,res)=>{
    try {
        const products = await productModel.find({})
        res.json({success:true,products})
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}
const singleProduct =async(req,res)=>{
    try {
        const {productId}=req.body
        const product= await productModel.findById(productId)
        res.json({success:true,product})
        
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}
export {addProduct,removeProduct,listProduct, singleProduct}