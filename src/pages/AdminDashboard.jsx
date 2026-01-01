// import React, { useMemo, useState, useEffect } from "react";
// import Select from "react-select";
// import windSensorData from "../data/windSensorData";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   LineElement,
//   BarElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// } from "chart.js";

// import { Pie, Bar, Line, Scatter, Doughnut } from "react-chartjs-2";

// ChartJS.register(
//   ArcElement,
//   LineElement,
//   BarElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// const AdminDashboard = () => {
//   const [stateFilter, setStateFilter] = useState(null);   // ✅ null = ALL
//   const [plantFilter, setPlantFilter] = useState(null); // ✅ null = ALL
//   const [userFilter, setUserFilter] = useState(null);

//   /* ================= AUTO STATE SYNC ================= */
//   useEffect(() => {
//     if (!plantFilter) {
//       setStateFilter(null);
//       return;
//     }

//     const plant = windSensorData.find(
//       d => d.plant_id === plantFilter
//     );

//     if (plant) {
//       setStateFilter(plant.State);
//     }
//   }, [plantFilter]);

//   /* ================= FILTERED DATA ================= */
//   const filteredData = useMemo(() => {
//     return windSensorData.filter(d =>
//       (!stateFilter || d.State === stateFilter) &&
//       (!plantFilter || d.plant_id === plantFilter) &&
//       (!userFilter || d.User_ID === userFilter)
//     );
//   }, [stateFilter, plantFilter, userFilter]);

//   /* ================= KPI ================= */
//   const kpis = useMemo(() => ({
//     plants: new Set(filteredData.map(d => d.plant_id)).size,
//     avgTPC:
//       filteredData.reduce(
//         (s, d) => s + (d["Theoretical_Power_Curve (KWh)"] || 0),
//         0
//       ) / (filteredData.length || 1),
//     totalInstall: filteredData.reduce(
//       (s, d) => s + (d.installation_price_lakhs || 0),
//       0
//     ),
//     turbines: filteredData.reduce(
//       (s, d) => s + (d.no_turbine || 0),
//       0
//     )
//   }), [filteredData]);

//   /* ================= AREA COUNT ================= */
//   const areaData = useMemo(() => {
//     const map = {};
//     filteredData.forEach(d => {
//       map[d.Area] = (map[d.Area] || 0) + 1;
//     });
//     return map;
//   }, [filteredData]);

//   /* ================= SCATTER ================= */
//   const scatterData = {
//     datasets: [{
//       label: "Total Cost vs Installation Cost",
//       data: filteredData.map(d => ({
//         x: d.total_cost_lakhs,
//         y: d.installation_price_lakhs
//       })),
//       backgroundColor: "#38bdf8"
//     }]
//   };

//   /* ================= BAR ================= */
//   const sectorBar = useMemo(() => {
//     const map = {};
//     filteredData.forEach(d => {
//       map[d.Sector] = (map[d.Sector] || 0) + d.no_turbine;
//     });
//     return map;
//   }, [filteredData]);

//   /* ================= LINE ================= */
//   const yearlyTrend = useMemo(() => {
//     const map = {};
//     filteredData.forEach(d => {
//       map[d.installation_year] =
//         (map[d.installation_year] || 0) + d.no_turbine;
//     });
//     return map;
//   }, [filteredData]);

//   /* ================= TABLE ================= */
//   const users = useMemo(() => {
//     const source = plantFilter
//       ? windSensorData.filter(d => d.plant_id === plantFilter)
//       : windSensorData;

//     const map = {};
//     source.forEach(d => {
//       if (!map[d.User_ID]) {
//         map[d.User_ID] = { name: d.User_Name, sum: 0, count: 0 };
//       }
//       map[d.User_ID].sum += d.selling_price_lakhs;
//       map[d.User_ID].count++;
//     });

//     return Object.entries(map).map(([id, v]) => ({
//       id,
//       name: v.name,
//       avg: (v.sum / v.count).toFixed(2)
//     }));
//   }, [plantFilter]);

//   /* ================= OPTIONS (SORTED) ================= */
//   const stateOptions = [...new Set(windSensorData.map(d => d.State))]
//     .sort()
//     .map(s => ({ value: s, label: s }));

//   const plantOptions = [...new Set(windSensorData.map(d => d.plant_id))]
//     .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
//     .map(p => ({ value: p, label: p }));

//   return (
//     <div className="dashboard">
//       <h1 className="dashboard-title">ADMIN DASHBOARD</h1>

//       {/* ================= FILTERS ================= */}
//       <div className="filters">
//         <div className="filter-box">
//           <label>State</label>
//           <Select
//             isSearchable
//             isClearable
//             isDisabled={!!plantFilter}
//             placeholder="All States"
//             value={stateOptions.find(o => o.value === stateFilter) || null}
//             options={stateOptions}
//             onChange={o => setStateFilter(o?.value || null)}
//           />
//         </div>

//         <div className="filter-box">
//           <label>Plant ID</label>
//           <Select
//             isSearchable
//             isClearable
//             placeholder="All Plants"
//             value={plantOptions.find(o => o.value === plantFilter) || null}
//             options={plantOptions}
//             onChange={o => setPlantFilter(o?.value || null)}
//           />
//         </div>
//       </div>

//       {/* ================= KPI ================= */}
//       <div className="kpis">
//         <div className="kpi"><h4>No of Plants</h4><span>{kpis.plants}</span></div>
//         <div className="kpi"><h4>Avg Theoretical Power Curve</h4><span>{kpis.avgTPC.toFixed(2)}</span></div>
//         <div className="kpi"><h4>Total Installation Cost(lakhs)</h4><span>{kpis.totalInstall.toFixed(2)}</span></div>
//         <div className="kpi"><h4>No of Turbines</h4><span>{kpis.turbines}</span></div>
//       </div>

//       {/* ================= GRID ================= */}
//       <div className="grid">

//         <div className="card">
//           <h3 className="card-title">Count of State by Area</h3>
//           <Pie data={{
//             labels: Object.keys(areaData),
//             datasets: [{ data: Object.values(areaData), backgroundColor: ["#22c55e", "#3b82f6", "#f97316"] }]
//           }} />
//         </div>

//         <div className="card">
//           <h3 className="card-title">Sum of Turbines by Sector</h3>
//           <Bar data={{
//             labels: Object.keys(sectorBar),
//             datasets: [{ data: Object.values(sectorBar), backgroundColor: "#6366f1" }]
//           }} />
//         </div>

//         <div className="card">
//           <h3 className="card-title">Turbine Trend by Year</h3>
//           <Line data={{
//             labels: Object.keys(yearlyTrend),
//             datasets: [{ data: Object.values(yearlyTrend), borderColor: "#ef4444" }]
//           }} />
//         </div>
//         <div className="card">
//           <h3 className="card-title">Count of State by Area (Gauge)</h3>
//           <Doughnut data={{
//             labels: Object.keys(areaData),
//             datasets: [{ data: Object.values(areaData), backgroundColor: ["#22c55e", "#3b82f6", "#f97316"], cutout: "70%" }]
//           }} />
//         </div>

//      <div className="card scatter-card">
//   <h3 className="card-title">Area vs Cost Scatter</h3>

//   <Scatter
//     data={{
//       datasets: [
//         {
//           label: "Plant Cost Distribution",
//           data: scatterData.datasets[0].data,
//           backgroundColor: "#38bdf8",
//           pointRadius: 5,
//           pointHoverRadius: 8
//         }
//       ]
//     }}
//     options={{
//       maintainAspectRatio: false,

//       interaction: {
//         mode: "nearest",
//         intersect: true
//       },

//       plugins: {
//         tooltip: {
//           enabled: true,
//           callbacks: {
//             label: (ctx) => {
//               const x = ctx.parsed.x;
//               const y = ctx.parsed.y;
//               return `Total Cost: ₹${x} L, Install Cost: ₹${y} L`;
//             }
//           }
//         },
//         legend: {
//           display: false
//         }
//       },

//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: "Total Cost (Lakhs)"
//           }
//         },
//         y: {
//           title: {
//             display: true,
//             text: "Installation Cost (Lakhs)"
//           }
//         }
//       }
//     }}
//   />
// </div>



//         <div className="card table-card">
//           <h3 className="card-title">User-wise Avg Selling Price</h3>
//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th>User ID</th>
//                   <th>User Name</th>
//                   <th>Avg Selling cost(lakhs)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map(u => (
//                   <tr key={u.id} onClick={() => setUserFilter(u.id)}>
//                     <td>{u.id}</td>
//                     <td>{u.name}</td>
//                     <td>{u.avg}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useMemo, useState, useEffect } from "react";
import Select from "react-select";
import windSensorData from "../data/windSensorData";

import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Pie, Bar, Line, Scatter, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stateFilter, setStateFilter] = useState(null);
  const [plantFilter, setPlantFilter] = useState(null);
  const [userFilter, setUserFilter] = useState(null);

  /* ================= AUTO STATE SYNC ================= */
  useEffect(() => {
    if (!plantFilter) {
      setStateFilter(null);
      return;
    }
    const plant = windSensorData.find(d => d.plant_id === plantFilter);
    if (plant) setStateFilter(plant.State);
  }, [plantFilter]);

  /* ================= FILTERED DATA ================= */
  const filteredData = useMemo(() => {
    return windSensorData.filter(d =>
      (!stateFilter || d.State === stateFilter) &&
      (!plantFilter || d.plant_id === plantFilter) &&
      (!userFilter || d.User_ID === userFilter)
    );
  }, [stateFilter, plantFilter, userFilter]);

  /* ================= CURRENT USER NAME ================= */
  const currentUserName = useMemo(() => {
    if (userFilter) {
      return (
        filteredData.find(d => d.User_ID === userFilter)?.User_Name ||
        "Selected User"
      );
    }
    const names = [...new Set(filteredData.map(d => d.User_Name))];
    return names.length === 1 ? names[0] : "Multiple Users";
  }, [filteredData, userFilter]);

  /* ================= KPI ================= */
  const kpis = useMemo(() => ({
    plants: new Set(filteredData.map(d => d.plant_id)).size,
    avgTPC:
      filteredData.reduce(
        (s, d) => s + (d["Theoretical_Power_Curve (KWh)"] || 0),
        0
      ) / (filteredData.length || 1),
    totalInstall: filteredData.reduce(
      (s, d) => s + (d.installation_price_lakhs || 0),
      0
    ),
    turbines: filteredData.reduce(
      (s, d) => s + (d.no_turbine || 0),
      0
    )
  }), [filteredData]);

  /* ================= AREA COUNT ================= */
  const areaData = useMemo(() => {
    const map = {};
    filteredData.forEach(d => {
      map[d.Area] = (map[d.Area] || 0) + 1;
    });
    return map;
  }, [filteredData]);

  /* ================= SCATTER ================= */
  const scatterData = {
    datasets: [
      {
        data: filteredData.map(d => ({
          x: d.total_cost_lakhs,
          y: d.installation_price_lakhs
        }))
      }
    ]
  };

  /* ================= BAR ================= */
  const sectorBar = useMemo(() => {
    const map = {};
    filteredData.forEach(d => {
      map[d.Sector] = (map[d.Sector] || 0) + d.no_turbine;
    });
    return map;
  }, [filteredData]);

  /* ================= LINE ================= */
  const yearlyTrend = useMemo(() => {
    const map = {};
    filteredData.forEach(d => {
      map[d.installation_year] =
        (map[d.installation_year] || 0) + d.no_turbine;
    });
    return map;
  }, [filteredData]);

  /* ================= TABLE ================= */
  const users = useMemo(() => {
    const source = plantFilter
      ? windSensorData.filter(d => d.plant_id === plantFilter)
      : windSensorData;

    const map = {};
    source.forEach(d => {
      if (!map[d.User_ID]) {
        map[d.User_ID] = { name: d.User_Name, sum: 0, count: 0 };
      }
      map[d.User_ID].sum += d.selling_price_lakhs;
      map[d.User_ID].count++;
    });

    return Object.entries(map).map(([id, v]) => ({
      id,
      name: v.name,
      avg: (v.sum / v.count).toFixed(2)
    }));
  }, [plantFilter]);

  /* ================= OPTIONS ================= */
  const stateOptions = [...new Set(windSensorData.map(d => d.State))]
    .sort()
    .map(s => ({ value: s, label: s }));

  const plantOptions = [...new Set(windSensorData.map(d => d.plant_id))]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(p => ({ value: p, label: p }));

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">ADMIN DASHBOARD</h1>

      {/* ================= FILTERS ================= */}
      <div className="filters">
        <div className="filter-box">
          <label>State</label>
          <Select
            isSearchable
            isClearable
            isDisabled={!!plantFilter}
            placeholder="All States"
            value={stateOptions.find(o => o.value === stateFilter) || null}
            options={stateOptions}
            onChange={o => setStateFilter(o?.value || null)}
          />
        </div>

        <div className="filter-box">
          <label>Plant ID</label>
          <Select
            isSearchable
            isClearable
            placeholder="All Plants"
            value={plantOptions.find(o => o.value === plantFilter) || null}
            options={plantOptions}
            onChange={o => setPlantFilter(o?.value || null)}
          />
        </div>
      </div>

      {/* ================= KPI ================= */}
      <div className="kpis">
        <div className="kpi">
          <h4>User Name</h4>
          <span>{currentUserName}</span>
        </div>

        <div className="kpi">
          <h4>No of Plants</h4>
          <span>{kpis.plants}</span>
        </div>

        <div className="kpi">
          <h4>Avg Theoretical Power Curve</h4>
          <span>{kpis.avgTPC.toFixed(2)}</span>
        </div>

        <div className="kpi">
          <h4>Total Installation Cost (Lakhs)</h4>
          <span>{kpis.totalInstall.toFixed(2)}</span>
        </div>

        <div className="kpi">
          <h4>No of Turbines</h4>
          <span>{kpis.turbines}</span>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid">

        <div className="card">
          <h3 className="card-title">Count of State by Area</h3>
          <Pie data={{
            labels: Object.keys(areaData),
            datasets: [{
              data: Object.values(areaData),
              backgroundColor: ["#22c55e","#3b82f6","#f97316"]
            }]
          }} />
        </div>

        <div className="card">
          <h3 className="card-title">Sum of Turbines by Sector</h3>
          <Bar data={{
            labels: Object.keys(sectorBar),
            datasets: [{
              data: Object.values(sectorBar),
              backgroundColor: "#6366f1"
            }]
          }} />
        </div>

        <div className="card">
          <h3 className="card-title">Turbine Trend by Year</h3>
          <Line data={{
            labels: Object.keys(yearlyTrend),
            datasets: [{
              data: Object.values(yearlyTrend),
              borderColor: "#ef4444"
            }]
          }} />
        </div>

        <div className="card">
          <h3 className="card-title">Count of State by Area (Gauge)</h3>
          <Doughnut data={{
            labels: Object.keys(areaData),
            datasets: [{
              data: Object.values(areaData),
              backgroundColor: ["#22c55e","#3b82f6","#f97316"],
              cutout: "70%"
            }]
          }} />
        </div>

        <div className="card scatter-card">
          <h3 className="card-title">Area vs Cost Scatter</h3>
          <Scatter
            data={{
              datasets: [{
                data: scatterData.datasets[0].data,
                backgroundColor: "#38bdf8",
                pointRadius: 5,
                pointHoverRadius: 8
              }]
            }}
            options={{
              maintainAspectRatio: false,
              interaction: { mode: "nearest", intersect: true },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: ctx =>
                      `Total Cost: ₹${ctx.parsed.x} L, Install Cost: ₹${ctx.parsed.y} L`
                  }
                },
                legend: { display: false }
              },
              scales: {
                x: { title: { display: true, text: "Total Cost (Lakhs)" } },
                y: { title: { display: true, text: "Installation Cost (Lakhs)" } }
              }
            }}
          />
        </div>

        <div className="card table-card">
          <h3 className="card-title">User-wise Avg Selling Price</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>User Name</th>
                  <th>Avg Selling Cost (Lakhs)</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} onClick={() => setUserFilter(u.id)}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
