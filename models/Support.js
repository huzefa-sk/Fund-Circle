import mongoose from "mongoose";

const SupportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true, 
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false, 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Support || mongoose.model("Support", SupportSchema);