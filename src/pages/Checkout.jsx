import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.total) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">
          Invalid payment session. Please go back to cart.
        </p>
        <button
          onClick={() => navigate("/cart")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go to Cart
        </button>
      </div>
    );
  }

  const payNow = () => {
  const options = {
  key: "rzp_test_S0cfplCvzKC0nm", // ✅ CORRECT TEST KEY
  amount: state.total * 100,
  currency: "INR",
  name: "SkyVolt Energy",
  description: "Renewable Plant Installation",

  handler: function (response) {
    alert("Payment Successful ✅");
    console.log(response);
  },

  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
  },
};


    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4">Payment</h2>

        <p className="text-lg mb-6">
          Total Payable:
          <span className="font-bold text-green-600">
            {" "}₹ {state.total}
          </span>
        </p>

        <button
          onClick={payNow}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-lg"
        >
          Pay with UPI / QR
        </button>
      </div>
    </div>
  );
};

export default Checkout;
