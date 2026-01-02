// import React, { useMemo } from "react";
// import { useAuth } from "../auth/AuthContext";
// import windSensorData from "../data/windSensorData";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// } from "chart.js";

// import { Bar, Doughnut } from "react-chartjs-2";

// /* REGISTER CHARTS */
// ChartJS.register(
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// const ClientDashboard = () => {
//   const { user } = useAuth();

//   /* ================= USER DATA ================= */
//   const userData = useMemo(
//     () => windSensorData.filter(d => d.user_email === user?.email),
//     [user]
//   );

//   const userInfo = userData[0] || {};

//   /* ================= KPI ================= */
//   const kpis = useMemo(() => ({
//     powerInput: userData.reduce(
//       (s, d) => s + (Number(d["power_per_turbine(KW)"]) || 0),
//       0
//     ),
//     powerOutput: userData.reduce(
//       (s, d) => s + (Number(d.Power_Output_kW) || 0),
//       0
//     ),
//     turbines: userData.reduce(
//       (s, d) => s + (Number(d.no_turbine) || 0),
//       0
//     )
//   }), [userData]);

//   /* ================= TPC vs LOSS ================= */
//   const tpcLoss = useMemo(() => ({
//     tpc: userData.reduce(
//       (s, d) => s + (Number(d["Theoretical_Power_Curve (KWh)"]) || 0),
//       0
//     ),
//     loss: userData.reduce(
//       (s, d) => s + (Number(d.power_loss) || 0),
//       0
//     )
//   }), [userData]);

//   /* ================= WIND SPEED ================= */
//   const windSpeedMap = useMemo(() => {
//     const map = {};
//     userData.forEach(d => {
//       const key = d.wind_speed_category || "Unknown";
//       map[key] = (map[key] || 0) + (Number(d["Wind_Speed (m/s)"]) || 0);
//     });
//     return map;
//   }, [userData]);

//   /* ================= WIND DIRECTION ================= */
//   const directionMap = useMemo(() => {
//     const map = {};
//     userData.forEach(d => {
//       const key = d.wind_direction_category || "Unknown";
//       map[key] = (map[key] || 0) + (Number(d.no_turbine) || 0);
//     });
//     return map;
//   }, [userData]);

//   /* ================= AVG POWER BY SECTOR & STATE ================= */
//   const powerBySectorState = useMemo(() => {
//     const map = {};
//     userData.forEach(d => {
//       const key = `${d.Sector}-${d.State}`;
//       if (!map[key]) map[key] = { label: key, sum: 0, count: 0 };
//       map[key].sum += Number(d.Power_Output_kW) || 0;
//       map[key].count++;
//     });
//     return Object.values(map);
//   }, [userData]);

//   return (
//     <div className="dashboard-wrapper">
//       <h3 className="dashboard-header">USER DASHBOARD</h3>

//       {/* USER INFO */}
//       <div className="grid-2">
//         <div className="equal-card blue">
//           <p>User ID</p>
//           <b>{userInfo.User_ID}</b>
//         </div>
//         <div className="equal-card green">
//           <p>User Name</p>
//           <b>{userInfo.User_Name}</b>
//         </div>
//       </div>

//       {/* KPI */}
//       <div className="grid-5">
//         <div className="equal-card purple">
//           <p>Power Input (kW)</p>
//           <b>{kpis.powerInput.toFixed(2)}</b>
//         </div>
//         <div className="equal-card orange">
//           <p>Power Output (kW)</p>
//           <b>{kpis.powerOutput.toFixed(2)}</b>
//         </div>
//         <div className="equal-card red">
//           <p>Total Turbines</p>
//           <b>{Math.round(kpis.turbines)}</b>
//         </div>
//         <div className="equal-card teal">
//           <p>State</p>
//           <b>{userInfo.State}</b>
//         </div>
//         <div className="equal-card indigo">
//           <p>City</p>
//           <b>{userInfo.City}</b>
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="grid-3">
//         <div className="equal-card white">
//           <h6>TPC vs Power Loss</h6>
//           <Bar
//             data={{
//               labels: ["Theoretical Power Curve", "Power Loss"],
//               datasets: [{
//                 data: [tpcLoss.tpc, tpcLoss.loss],
//                 backgroundColor: ["#2563eb", "#ef4444"]
//               }]
//             }}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               scales: { y: { beginAtZero: true } }
//             }}
//           />
//         </div>

//         <div className="equal-card white">
//           <h6>Wind Speed Category</h6>
//           <Bar
//             data={{
//               labels: Object.keys(windSpeedMap),
//               datasets: [
//                 {
//                   label: "Total Wind Speed (m/s)",
//                   data: Object.values(windSpeedMap),
//                   backgroundColor: [
//                     "#22c55e",
//                     "#3b82f6",
//                     "#f97316",
//                     "#a855f7",
//                     "#ef4444"
//                   ],
//                   borderRadius: 8
//                 }
//               ]
//             }}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               indexAxis: "y", // ✅ horizontal bar
//               scales: {
//                 x: { beginAtZero: true }
//               },
//               plugins: {
//                 legend: { display: false }
//               }
//             }}
//           />
//         </div>
//         <div className="equal-card white">
//           <h6>Wind Direction vs Turbines</h6>
//           <Bar
//             data={{
//               labels: Object.keys(directionMap),
//               datasets: [{
//                 data: Object.values(directionMap),
//                 backgroundColor: "#38bdf8"
//               }]
//             }}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               scales: { y: { beginAtZero: true } }
//             }}
//           />
//         </div>
//       </div>

//       {/* REDUCED WIDTH CHART */}
//       <div className="grid-center">
//         <div className="equal-card white medium-width">
//           <h6>Avg Power Output by Sector & State</h6>
//           <Bar
//             data={{
//               labels: powerBySectorState.map(d => d.label),
//               datasets: [{
//                 data: powerBySectorState.map(d => d.sum / d.count),
//                 backgroundColor: "#6366f1"
//               }]
//             }}
//             options={{
//               responsive: true,
//               maintainAspectRatio: false,
//               scales: { y: { beginAtZero: true } }
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;

import React, { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import windSensorData from "../data/windSensorData";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";

/* REGISTER */
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
);

const ClientDashboard = () => {
  const { user } = useAuth();

  /* ================= USER DATA ================= */
  const userData = useMemo(
    () => windSensorData.filter(d => d.user_email === user?.email),
    [user]
  );

  const userInfo = userData[0] || {};

  /* ================= KPI ================= */
  const kpis = useMemo(() => ({
    powerInput: userData.reduce((s, d) => s + (+d["power_per_turbine(KW)"] || 0), 0),
    powerOutput: userData.reduce((s, d) => s + (+d.Power_Output_kW || 0), 0),
    turbines: userData.reduce((s, d) => s + (+d.no_turbine || 0), 0)
  }), [userData]);

  /* ================= AVERAGES FOR GAUGES ================= */
  const avgGeneratorRPM = useMemo(() => {
    if (!userData.length) return 0;
    return Math.round(
      userData.reduce((s, d) => s + (+d.Generator_Speed_RPM || 0), 0) /
      userData.length
    );
  }, [userData]);

  const avgWindSpeed = useMemo(() => {
    if (!userData.length) return 0;
    return +(
      userData.reduce((s, d) => s + (+d["Wind_Speed (m/s)"] || 0), 0) /
      userData.length
    ).toFixed(1);
  }, [userData]);

  const MAX_RPM = 2000;
  const MAX_WIND = 30;

  /* ================= TPC & LOSS BY SECTOR ================= */
  const tpcLossBySector = useMemo(() => {
    const map = {};
    userData.forEach(d => {
      const s = d.Sector || "Unknown";
      if (!map[s]) map[s] = { tpc: 0, loss: 0 };
      map[s].tpc += +d["Theoretical_Power_Curve (KWh)"] || 0;
      map[s].loss += +d.power_loss || 0;
    });
    return map;
  }, [userData]);

  /* ================= WIND DIRECTION vs TURBINES ================= */
  const windDirectionTurbines = useMemo(() => {
    const map = {};
    userData.forEach(d => {
      const k = d.wind_direction_category || "Unknown";
      map[k] = (map[k] || 0) + (+d.no_turbine || 0);
    });
    return map;
  }, [userData]);

  /* ================= AVG POWER BY SECTOR ================= */
  const avgPower = useMemo(() => {
    const agri = [], res = [];
    userData.forEach(d => {
      const v = (+d.Power_Output_kW || 0);
      if (d.Sector === "Agriculture") agri.push(v);
      if (d.Sector === "Residential") res.push(v);
    });
    const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
    return {
      Agriculture: avg(agri),
      Residential: avg(res)
    };
  }, [userData]);

  /* ================= TABLE DATA ================= */
  const tableData = useMemo(() => {
    const map = {};
    userData.forEach(d => {
      const key = `${d.User_ID}-${d.User_Name}`;
      if (!map[key]) {
        map[key] = {
          userId: d.User_ID,
          userName: d.User_Name,
          plants: new Set(),
          city: d.City,
          state: d.State
        };
      }
      map[key].plants.add(d.Plant_Name);
    });
    return Object.values(map).map(d => ({
      ...d,
      plantNames: Array.from(d.plants).join(", ")
    }));
  }, [userData]);

  /* ================= GAUGE COMPONENT (SMALL) ================= */
  const Gauge = ({ value, max, label, unit, color }) => {
    const percent = Math.min((value / max) * 100, 100);

    return (
      <div className="equal-card white" style={{ height: 200, position: "relative" }}>
        <h6 style={{ textAlign: "center" }}>{label}</h6>

        <Doughnut
          data={{
            labels: ["Value", "Remaining"],
            datasets: [{
              data: [value, max - value],
              backgroundColor: [color, "#e5e7eb"],
              borderWidth: 0,
              cutout: "70%"
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: 270,
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: ctx =>
                    ctx.dataIndex === 0
                      ? `${label}: ${value} ${unit}`
                      : ""
                }
              }
            }
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}
        >
          {value} {unit}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-wrapper">
      <h3 className="dashboard-header">USER DASHBOARD</h3>

      {/* KPI */}
      <div className="grid-5">
        <div className="equal-card purple"><p>Power / Turbine</p><b>{kpis.powerInput.toFixed(2)}</b></div>
        <div className="equal-card orange"><p>Total Power</p><b>{kpis.powerOutput.toFixed(2)}</b></div>
        <div className="equal-card red"><p>Total Turbines</p><b>{kpis.turbines}</b></div>
      </div>

      {/* CHARTS */}
      <div className="grid-3">
        <div className="equal-card white">
          <h6>TPC & Power Loss by Sector</h6>
          <Line
            data={{
              labels: Object.keys(tpcLossBySector),
              datasets: [
                { label: "TPC", data: Object.values(tpcLossBySector).map(d => d.tpc), borderColor: "#2563eb" },
                { label: "Loss", data: Object.values(tpcLossBySector).map(d => d.loss), borderColor: "#ef4444" }
              ]
            }}
          />
        </div>

        <div className="equal-card white">
          <h6>Wind Direction vs Turbines</h6>
          <Bar
            data={{
              labels: Object.keys(windDirectionTurbines),
              datasets: [{
                label: "Turbines",
                data: Object.values(windDirectionTurbines),
                backgroundColor: "#38bdf8"
              }]
            }}
          />
        </div>

        {/* ✅ AVG POWER OUTPUT – FULLY DYNAMIC */}
<div className="equal-card white">
  <h6>Avg Power Output by Sector</h6>

  <Bar
    data={{
      labels: Object.keys(avgPower),
      datasets: [
        {
          label: "Average Power Output (kW)",
          data: Object.values(avgPower),
          backgroundColor: [
            "#22c55e", // Agriculture
            "#2563eb"  // Residential
          ]
        }
      ]
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx =>
              `${ctx.label}: ${ctx.parsed.y.toFixed(2)} kW`
          }
        }
      }
    }}
  />
</div>

      </div>

      {/* TABLE */}
      <div className="grid-center">
        <div className="equal-card white medium-width">
          <h6>User – Plant Details</h6>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Plant Name(s)</th>
                <th>City</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((d, i) => (
                <tr key={i}>
                  <td>{d.userId}</td>
                  <td>{d.userName}</td>
                  <td>{d.plantNames}</td>
                  <td>{d.city}</td>
                  <td>{d.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GAUGES */}
      <div className="grid-2">
        <Gauge label="Avg Generator Speed" value={avgGeneratorRPM} max={MAX_RPM} unit="RPM" color="#22c55e" />
        <Gauge label="Avg Wind Speed" value={avgWindSpeed} max={MAX_WIND} unit="m/s" color="#2563eb" />
      </div>
    </div>
  );
};

export default ClientDashboard;
