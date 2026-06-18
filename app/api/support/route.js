import mongodb from "@/lib/mongodb";
import Support from "@/models/Support";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import crypto from "crypto";


export async function POST(request) {
  try {
    await mongodb();
    const {
      name,
      message,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = await request.json();

    if (!amount || !razorpay_order_id) {
      return Response.json({ success: false, message: "Missing payment data" }, { status: 400 });
    }





    const body = razorpay_order_id + "|" + razorpay_payment_id;


    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET) // Matches your .env
      .update(body.toString())
      .digest("hex");

    //to not let any one by pass system with api req on dev tools it will worl only if rayzorpay sign matches
    if (expectedSignature !== razorpay_signature) {
      return Response.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }





    const newSupport = await Support.create({
      name: name || "Anonymous Developer",
      message,
      amount: Number(amount),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isCompleted: true
    });

    return Response.json({ success: true, data: newSupport });
  } catch (error) {
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await mongodb();
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const supports = await Support.find().sort({ createdAt: -1 });

    return Response.json({ success: true, data: supports });
  } catch (error) {
    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}