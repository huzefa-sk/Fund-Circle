"use client";

import { useState } from "react";



export default function SupportForm() {
  const [amount, setAmount] = useState(500);
  // We initialize customAmount to "500" so it starts populated in the field
  const [customAmount, setCustomAmount] = useState("500");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const [errors, setErrors] = useState({});

  const presetAmounts = [100, 250, 500, 1000];


  const loadRazorpay = () => {

    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }







  const validateForm = (finalAmount) => {
    const newErrors = {};

    if (!finalAmount || finalAmount < 1) {
      newErrors.amount = "Please select or enter an amount of at least ₹1.";
    }
    if (finalAmount > 10000) {
      newErrors.amount = "Amount exceeds maximum limit for a single transaction i.e. 10,000.";
    }
    if (name.length > 50) {
      newErrors.name = "Name must be under 50 characters.";
    }
    if (message.length > 250) {
      newErrors.message = "Message must be under 250 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // We rely on customAmount now since it always reflects the current value
    const finalAmount = Number(customAmount) || amount;

    if (!validateForm(finalAmount)) {
      return;
    }




    setStatus("loading");


    const isLoaded = await loadRazorpay();

    if (!isLoaded) {

      alert("Razorpay SDK failed to load. Check your internet connection")
      setStatus("error");
      return;
    }




    try {
      //dummy payment
      // const response = await fetch("/api/support", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     name: name.trim() || "Anonymous Developer",
      //     message: message.trim(),
      //     amount: finalAmount,
      //   }),
      // });

      const orderResponse = await fetch("/api/razorpay/order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: finalAmount })
        }
      )

      const orderData = await orderResponse.json();

      if (!orderData.orderID) {
        throw new Error("Failed to generate Order ID from server");
      }


      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_APIKEY,
        amount: finalAmount * 100,
        currency: "INR",
        name: "SyntaxError Project",
        description: "Supporting the build",
        order_id: orderData.orderID,

        handler: async function (response) {
          console.log("Payment Successful! Saving to database...", response);

          try {
            const dbResponse = await fetch("/api/support", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: name.trim() || "Anonymous Developer",
                message: message.trim(),
                amount: finalAmount,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            

            const result = await dbResponse.json();



            if (result.success) {
              setStatus("success");
              setName("");
              setMessage("");
              setCustomAmount("500");
              setAmount(500);
              setErrors({});
            } else {
              setStatus("error");
            }
          } catch (dbError) {
            console.error("Failed to save to database:", dbError);
            setStatus("error");
          }
        },

        prefill: {
          name: name || "Anonymous Developer",
        },
        theme: {
          color: "#9333ea"
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error.description);
        setStatus("error");
      });

      paymentObject.open();







    } catch (error) {
      console.error("Payment submission failed:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl text-center">
        <h3 className="text-xl font-bold mb-2">Thank you! 🎉</h3>
        <p>Your support data was successfully saved to the database.</p>
        <button
          onClick={() => { setStatus("idle"); setAmount(500); setCustomAmount("500"); }}
          className="mt-4 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Support the Build</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Amount Selectors */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Select Amount (₹)</label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  setCustomAmount(preset.toString()); // Populates the field
                  setErrors({ ...errors, amount: null });
                }}
                className={`py-2 rounded-lg font-semibold transition-all ${amount === preset
                    ? "bg-purple-600 text-white border border-purple-500"
                    : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                  }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1" // <--- This prevents the browser from allowing zero or negative numbers
            placeholder="Custom Amount"
            value={customAmount}
            onChange={(e) => {
              const val = e.target.value;
              setCustomAmount(val);

              if (presetAmounts.includes(Number(val))) {
                setAmount(Number(val));
              } else {
                setAmount(0);
              }

              setErrors({ ...errors, amount: null });
            }}
            className={`w-full bg-black border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition ${errors.amount ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'} [color-scheme:dark] [&::-webkit-inner-spin-button]:opacity-40 hover:[&::-webkit-inner-spin-button]:opacity-80 transition-opacity`}
          />
          {errors.amount && <p className="text-red-400 text-xs mt-1.5">{errors.amount}</p>}
        </div>

        {/* Name Input */}
        {/* Name Input */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">Your Name (Optional)</label>
            <span className={`text-xs ${name.length >= 50 ? 'text-red-400 font-bold' : 'text-gray-600'}`}>{name.length}/50</span>
          </div>
          <input
            type="text"
            maxLength={50} // <--- Hard caps typing at exactly 50 characters
            placeholder="John Doe"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: null }); }}
            className={`w-full bg-black border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition ${errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'}`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-gray-400">Message (Optional)</label>
            <span className={`text-xs ${message.length >= 250 ? 'text-red-400 font-bold' : 'text-gray-600'}`}>{message.length}/250</span>
          </div>
          <textarea
            placeholder="Keep up the great engineering work!"
            maxLength={250}
            value={message}
            onChange={(e) => { setMessage(e.target.value); setErrors({ ...errors, message: null }); }}
            rows={3}
            className={`w-full bg-black border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition resize-none ${errors.message ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 custom-scrollbar'}`}
          />
          {errors.message && <p className="text-red-400 text-xs mt-1.5">{errors.message}</p>}
        </div>

        {status === "error" && (
          <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">Something went wrong connecting to the server.</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading" || (!amount && !customAmount)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Processing..." : `Proceed to Pay ₹${customAmount || amount}`}
        </button>

      </form>
    </div>
  );
}