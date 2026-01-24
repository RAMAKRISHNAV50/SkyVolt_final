import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext";

import "./index.css";
import "./styles/About.css";
import "./styles/Home.css";
import "./styles/Contact.css";
import "./styles/Login.css";
import "./styles/Navbar.css";
import "./styles/adminDashboard.css";
import "./styles/footer.css";
import "./styles/PricingPlans.css"
import "./styles/EditProfile.css"
import "./styles/ClientDashboard.css"
import "./styles/Products.css"
import "./styles/Cart.css";
import "./styles/Checkout.css";
import "./styles/WindEnergyPage.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
