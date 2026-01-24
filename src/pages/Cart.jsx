
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [couponActive, setCouponActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [installerCost, setInstallerCost] = useState(0);

  /* ================= CALCULATIONS ================= */
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount =
    couponActive && coupon === "SAVE30" ? subtotal * 0.3 : 0;

  const total = subtotal + installerCost - discount;

  /* ================= PROMO TIMER ================= */
  useEffect(() => {
    if (!couponActive) return;

    if (timeLeft <= 0) {
      setCouponActive(false);
      setCoupon("");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [couponActive, timeLeft]);

  /* ================= APPLY COUPON ================= */
  const applyCoupon = () => {
    if (coupon === "SAVE30") {
      setCouponActive(true);
      setTimeLeft(300);
    }
  };

  /* ================= TIME FORMAT ================= */
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="container py-5 cart-page">

      {/* TITLE */}
      <h2 className="fw-bold mb-4 text-center">
        Your Cart
      </h2>

      {/* CART ITEMS */}
      {cart.length === 0 && (
        <p className="text-muted text-center">
          Your cart is empty
        </p>
      )}

      {cart.map((item) => (
        <div
          key={item.id}
          className="card cart-item mb-3"
        >
          <div className="card-body d-flex align-items-center gap-4">
            
            {/* IMAGE */}
            <div className="cart-img">
              <img src={item.img} alt={item.name} />
            </div>

            {/* INFO */}
            <div className="flex-grow-1">
              <h5 className="mb-1">{item.name}</h5>
              <p className="text-muted mb-0">
                Quantity: {item.qty}
              </p>
            </div>

            {/* PRICE */}
            <div className="text-end">
              <h5 className="text-success mb-0">
                ₹ {item.price * item.qty}
              </h5>
            </div>
          </div>
        </div>
      ))}

      {/* INSTALLATION */}
      <div className="mt-4">
        <label className="form-label fw-semibold">
          Installation Service
        </label>
        <select
          className="form-select"
          onChange={(e) => setInstallerCost(Number(e.target.value))}
        >
          <option value={0}>Self Installation (₹0)</option>
          <option value={60000}>
            Professional Installation (75,000)
          </option>
        </select>
      </div>

      {/* COUPON */}
      <div className="mt-4">
        <label className="form-label fw-semibold">
          Promo Code
        </label>

        <div className="input-group">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter promo code"
            className="form-control"
          />
          <button
            className="btn btn-success"
            onClick={applyCoupon}
          >
            Apply
          </button>
        </div>

        {couponActive && (
          <p className="text-success mt-2">
            Promo valid for: {formatTime()}
          </p>
        )}

        {!couponActive && coupon && (
          <p className="text-danger mt-2">
            Promo expired
          </p>
        )}
      </div>

      {/* SUMMARY */}
      <div className="card summary-card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>

          <div className="d-flex justify-content-between mb-2">
            <span>Installation</span>
            <span>₹ {installerCost}</span>
          </div>

          <div className="d-flex justify-content-between text-success mb-2">
            <span>Discount</span>
            <span>- ₹ {discount}</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between fs-5 fw-bold">
            <span>Total</span>
            <span>₹ {total}</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="d-flex gap-3 mt-4">
        <button
          className="btn btn-secondary flex-fill py-2"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>

        <button
          className="btn btn-primary flex-fill py-2"
          onClick={() =>
            navigate("/checkout", { state: { total } })
          }
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Cart;
