// import React, { Suspense, lazy } from "react";

// // Lazy load dashboards
// const AdminDashboard = lazy(() => import("./AdminDashboard"));
// const UserDashboard = lazy(() => import("./UserDashboard"));

// const Dashboard = () => {
//   const role = localStorage.getItem("role"); // admin / client

//   return (
//     <Suspense
//       fallback={
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//           <h3>Loading Dashboard...</h3>
//         </div>
//       }
//     >
//       {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
//     </Suspense>
//   );
// };

// export default Dashboard;
// // const Dashboard = () => (
// // <div className="container-fluid">
// // <UserDashboard />
// // <AdminDashboard />
// // </div>
// // );
// // export default Dashboard;

// const UserDashboard = () => {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>User Dashboard</h2>
//       <p>Welcome to the user dashboard.</p>
//     </div>
//   );
// };

// export default UserDashboard;

