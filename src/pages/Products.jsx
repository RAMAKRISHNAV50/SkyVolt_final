// import { useState } from "react";
// import products from "../data/products";
// import { useCart } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";

// const Products = () => {
//   const { addItem, removeItem, cart } = useCart();
//   const navigate = useNavigate();

//   const [toast, setToast] = useState(false);

//   const getQty = (id) =>
//     cart.find(p => p.id === id)?.qty || 0;

//   const handleAdd = (product) => {
//     addItem(product);
//     setToast(true);

//     setTimeout(() => {
//       setToast(false);
//     }, 3000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 relative">

//       {/* 🔔 TOAST NOTIFICATION */}
//       {toast && (
//         <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
//           ✅ Item added successfully
//         </div>
//       )}

//       {/* PAGE TITLE */}
//       <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
//         Installation Products
//       </h2>

//       {/* PRODUCTS GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {products.map(p => (
//           <div
//             key={p.id}
//             className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 p-6 text-center"
//           >
//             {/* IMAGE FIX */}
//             <div className="h-40 flex items-center justify-center mb-4">
//               <img
//                 src={p.img}
//                 alt={p.name}
//                 className="max-h-full object-contain"
//               />
//             </div>

//             <h3 className="text-xl font-semibold text-gray-800">
//               {p.name}
//             </h3>

//             <p className="text-green-600 font-bold mt-2 text-lg">
//               ₹ {p.price}
//             </p>

//             {/* ADD / REMOVE */}
//             <div className="flex justify-center items-center gap-5 mt-6">
//               <button
//                 onClick={() => removeItem(p.id)}
//                 className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full text-xl"
//               >
//                 −
//               </button>

//               <span className="text-lg font-semibold">
//                 {getQty(p.id)}
//               </span>

//               <button
//                 onClick={() => handleAdd(p)}
//                 className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full text-xl"
//               >
//                 +
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ACTION BUTTONS */}
//       <div className="flex justify-center gap-6 mt-14">
//         {/* 🔙 BACK BUTTON */}
//         <button
//           onClick={() => navigate(-1)}
//           className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
//         >
//           ⬅ Back
//         </button>

//         {/* 🛒 CART BUTTON */}
//         <button
//           onClick={() => navigate("/cart")}
//           className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//         >
//           Go To Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Products;


import { useState } from "react";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { addItem, removeItem, cart } = useCart();
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);

  const getQty = (id) =>
    cart.find((p) => p.id === id)?.qty || 0;

  const handleAdd = (product) => {
    addItem(product);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="container py-5 position-relative">

      {/* 🔔 TOAST */}
      {toast && (
        <div className="toast-custom">
          ✅ Item added successfully
        </div>
      )}

      {/* TITLE */}
      <h2 className="text-center mb-5 fw-bold">
        Installation Products
      </h2>

      {/* PRODUCTS GRID */}
      <div className="row g-4">
        {products.map((p) => (
          <div key={p.id} className="col-sm-6 col-md-4">
            <div className="card product-card h-100 text-center">
              
              {/* IMAGE */}
              <div className="product-image">
                <img src={p.img} alt={p.name} />
              </div>

              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="price">₹ {p.price}</p>

                {/* ADD / REMOVE */}
                <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                  <button
                    className="btn btn-danger btn-circle"
                    onClick={() => removeItem(p.id)}
                  >
                    −
                  </button>

                  <span className="fw-bold fs-5">
                    {getQty(p.id)}
                  </span>

                  <button
                    className="btn btn-success btn-circle"
                    onClick={() => handleAdd(p)}
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="d-flex justify-content-center gap-4 mt-5">
        <button
          className="btn btn-secondary px-4 py-2"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>

        <button
          className="btn btn-primary px-4 py-2"
          onClick={() => navigate("/cart")}
        >
          Go To Cart
        </button>
      </div>
    </div>
  );
};

export default Products;
