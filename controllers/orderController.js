import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import productModel from "../models/productModels.js"; 


const placeOrder = async (req, res) => {
  try {
    const { userId, items, address, amount } = req.body;

    if (!userId || !items || !address || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Populate each item with product details
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await productModel.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          size: item.size || "M",
          quantity: item.quantity || 1,
          image: product.image, // array of images
        };
      })
    );

    const orderData = {
      userId,
      items: populatedItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const placeOrderStripe = async (req, res) => {
  return res.status(501).json({ success: false, message: "Stripe payment not available currently" });
};


const placeOrderRazorpay = async (req, res) => {
  return res.status(501).json({ success: false, message: "Razorpay payment not available currently" });
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ date: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const orderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
 const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  orderStatus,
  deleteOrder
};
