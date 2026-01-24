import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.total) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger fw-semibold">
          Invalid payment session. Please go back to cart.
        </p>
        <button
          onClick={() => navigate("/cart")}
          className="btn btn-primary mt-3"
        >
          Go to Cart
        </button>
      </div>
    );
  }

  const payNow = () => {
    const options = {
      key: "rzp_test_S0cfplCvzKC0nm",
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
    <div className="container d-flex justify-content-center align-items-center checkout-page">
      <div className="card checkout-card text-center">
        <div className="card-body p-4">

          <h2 className="fw-bold mb-3">Payment</h2>

          <p className="fs-5 mb-4">
            Total Payable:
            <span className="fw-bold text-success ms-2">
              ₹ {state.total}
            </span>
          </p>

          <button
            onClick={payNow}
            className="btn btn-purple w-100 py-3 mb-3"
          >
            Pay with UPI / QR
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="btn btn-outline-secondary w-100"
          >
            ⬅ Back to Cart
          </button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
