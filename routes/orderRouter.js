import express from 'express'

import { placeOrder,placeOrderRazorpay,placeOrderStripe,allOrders,orderStatus,userOrders ,deleteOrder} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js';



const orderRouter= express.Router();

//payment gateways
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

//admin panel features 
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,orderStatus)
orderRouter.delete('/delete/:id',deleteOrder)

//user features
orderRouter.post('/userOrders',authUser,userOrders)


export default orderRouter
