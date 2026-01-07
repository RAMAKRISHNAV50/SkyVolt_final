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
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [couponActive, timeLeft]);

  /* ================= APPLY COUPON ================= */
  const applyCoupon = () => {
    if (coupon === "SAVE30") {
      setCouponActive(true);
      setTimeLeft(300); // 5 minutes
    }
  };

  /* ================= TIME FORMAT ================= */
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-3xl mx-auto">

      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Your Cart
      </h2>

      {/* CART ITEMS */}
      {cart.length === 0 && (
        <p className="text-gray-500">Your cart is empty</p>
      )}

      {cart.map(item => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-white p-4 rounded-xl shadow-md mb-4"
        >
          {/* PRODUCT IMAGE */}
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow">
            <img
              src={item.img}
              alt={item.name}
              className="max-h-full object-contain"
            />
          </div>

          {/* PRODUCT INFO */}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">
              {item.name}
            </h4>
            <p className="text-sm text-gray-500">
              Quantity: {item.qty}
            </p>
          </div>
          {/* PRICE */}
          <div className="text-right">
            <p className="font-bold text-green-600 text-lg">
              ₹ {item.price * item.qty}
            </p>
          </div>
        </div>
      ))}
      {/* INSTALLATION PERSON DROPDOWN */}
      <div className="mt-6">
        <label className="block font-semibold mb-2">
          Installation Service
        </label>

        <select
          className="w-full border rounded-lg p-2"
          onChange={e => setInstallerCost(Number(e.target.value))}
        >
          <option value={0}>Self Installation (₹0)</option>
          <option value={200000}>Professional Installation (₹2,00,000)</option>
        </select>
      </div>

      {/* COUPON SECTION */}
      <div className="mt-6">
        <label className="block font-semibold mb-2">
          Promo Code
        </label>

        <div className="flex gap-3">
          <input
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 border p-2 rounded-lg"
          />
          <button
            onClick={applyCoupon}
            className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg"
          >
            Apply
          </button>
        </div>

        {couponActive && (
          <p className="text-sm text-green-600 mt-2">
            Promo valid for: {formatTime()}
          </p>
        )}

        {!couponActive && coupon && (
          <p className="text-sm text-red-500 mt-2">
            Promo expired
          </p>
        )}
      </div>

      {/* PRICE SUMMARY */}
      <div className="bg-white rounded-lg shadow p-4 mt-6 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹ {subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Installation</span>
          <span>₹ {installerCost}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>- ₹ {discount}</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg"
        >
          ⬅ Back
        </button>

        <button
          onClick={() =>
            navigate("/checkout", { state: { total } })
          }
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Cart;
