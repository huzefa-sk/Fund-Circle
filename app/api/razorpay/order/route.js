import Razorpay from "razorpay";
import { NextResponse } from "next/server";


const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_APIKEY,
    key_secret: process.env.RAZORPAY_SECRET

})


export async function POST(req) {
    try {

        const { amount } = await req.json();

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        }

        const order=await razorpay.orders.create(options)

        return NextResponse.json(
            {
                orderID:order.id
            }
        )
    }
    catch(err) {
        console.error("Order Creation Error:",err)
        return NextResponse.json({error:"Failed to create order"},{status:500})
    }

}