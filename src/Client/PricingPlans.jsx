import { doc, updateDoc } from "firebase/firestore";
// import { db } from ".firebase/firebase.js";
import { auth, db } from "../../firebase";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const PricingPlans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const selectPlan = async (plan) => {
    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      plan: plan,
      freeTrialsLeft: plan === "free" ? 8 : 0,
    });

    navigate("/client-dashboard");
  };

  return (
    <div className="pricing-page">
      <h1>Choose Your Plan</h1>
      <p>Upgrade anytime to continue uninterrupted access</p>

      <div className="pricing-grid">
        {/* FREE PLAN */}
        <div className="plan-card">
          <h2>Free</h2>
          <h3>₹0</h3>
          <ul>
            <li>8 Free Trials</li>
            <li>Limited Access</li>
            <li>Community Support</li>
          </ul>
          <button onClick={() => selectPlan("free")}>
            Choose Free
          </button>
        </div>

        {/* BASIC PLAN */}
        <div className="plan-card highlight">
          <h2>Basic</h2>
          <h3>₹499 / month</h3>
          <ul>
            <li>Unlimited Access</li>
            <li>All Charts</li>
            <li>Email Support</li>
          </ul>
          <button onClick={() => selectPlan("basic")}>
            Upgrade to Basic
          </button>
        </div>

        {/* ADVANCED PLAN */}
        <div className="plan-card">
          <h2>Advanced</h2>
          <h3>₹999 / month</h3>
          <ul>
            <li>Unlimited Access</li>
            <li>Advanced Analytics</li>
            <li>Priority Support</li>
          </ul>
          <button onClick={() => selectPlan("advanced")}>
            Upgrade to Advanced
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
