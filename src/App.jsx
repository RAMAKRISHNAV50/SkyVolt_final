// import React, { Suspense } from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// /* LAZY PAGES */
// const Home = React.lazy(() => import("./pages/Home"));
// const About = React.lazy(() => import("./pages/About"));
// const Contact = React.lazy(() => import("./pages/Contact"));
// const Login = React.lazy(() => import("./pages/Login"));
// const Signup = React.lazy(() => import("./pages/Signup"));
// const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
// const ClientDashboard = React.lazy(() => import("./pages/ClientDashboard"));
// const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));
// import ForgotPassword from "./pages/ForgotPassword";
// import VerifyOtp from "./pages/VerifyOtp";
// import ResetPassword from "./pages/ResetPassword";
// const EditProfile = React.lazy(() => import("./pages/EditProfile"))
// const ProtectedRoute = React.lazy(() => import("./auth/ProtectedRoute"));

// function App() {
//   return (
//     <>
//       <Suspense fallback={<div style={{ padding: 30 }}>Loading...</div>}>
//         <Navbar />
//         <Routes>
//           {/* PUBLIC ROUTES */}
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/Login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/admin-dashboard" element={<ProtectedRoute allow={["admin"]}><AdminDashboard /></ProtectedRoute>} />
//           {/* CLIENT ONLY */}
//           <Route
//             path="/client-dashboard"
//             element={
//               <ProtectedRoute allow={["client"]}>
//                 <ClientDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* 404 */}
//           <Route path="*" element={<PageNotFound />} />
//           <Route
//             path="/edit-profile"
//             element={
//               <ProtectedRoute >
//                 <EditProfile />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//         <Footer />
//       </Suspense>
//     </>
//   );
// }

// export default App;

import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* LAZY PAGES */
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const ClientDashboard = React.lazy(() => import("./pages/ClientDashboard"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));
const EditProfile = React.lazy(() => import("./pages/EditProfile"));
const ProtectedRoute = React.lazy(() => import("./auth/ProtectedRoute"));

import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import AccessDenied from "./pages/AccessDenied";
import PricingPlans from "./Client/PricingPlans";
import ClientRoute from "./ClientRoute";

function App() {
  return (
    <Suspense fallback={<div style={{ padding: 30 }}>Loading...</div>}>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pricing" element={<PricingPlans />} />

        {/* ADMIN ONLY */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* CLIENT ONLY */}
        <Route
          path="/client-dashboard"
          element={
            <ClientRoute>
              <ClientDashboard />
            </ClientRoute>
          }
        />

        {/* ANY LOGGED-IN USER */}
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/access-denied" element={<AccessDenied />} />

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Footer />
    </Suspense>
  );
}

export default App;
