import React, { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import windSensorData from "../data/windSensorData";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

/* REGISTER CHARTS */
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
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
    powerInput: userData.reduce(
      (s, d) => s + (Number(d["power_per_turbine(KW)"]) || 0),
      0
    ),
    powerOutput: userData.reduce(
      (s, d) => s + (Number(d.Power_Output_kW) || 0),
      0
    ),
    turbines: userData.reduce(
      (s, d) => s + (Number(d.no_turbine) || 0),
      0
    )
  }), [userData]);

  /* ================= TPC vs LOSS ================= */
  const tpcLoss = useMemo(() => ({
    tpc: userData.reduce(
      (s, d) => s + (Number(d["Theoretical_Power_Curve (KWh)"]) || 0),
      0
    ),
    loss: userData.reduce(
      (s, d) => s + (Number(d.power_loss) || 0),
      0
    )
  }), [userData]);

  /* ================= WIND SPEED ================= */
  const windSpeedMap = useMemo(() => {
    const map = {};
    userData.forEach(d => {
      const key = d.wind_speed_category || "Unknown";
      map[key] = (map[key] || 0) + (Number(d["Wind_Speed (m/s)"]) || 0);
    });
    return map;
  }, [userData]);

  /* ================= WIND DIRECTION ================= */
  const directionMap = useMemo(() => {
    const map = {};
    userData.forEach(d => {
      const key = d.wind_direction_category || "Unknown";
      map[key] = (map[key] || 0) + (Number(d.no_turbine) || 0);
    });
    return map;
  }, [userData]);

  /* ================= AVG POWER BY SECTOR & STATE ================= */
  const powerBySectorState = useMemo(() => {
    const map = {};
    userData.forEach(d => {
      const key = `${d.Sector}-${d.State}`;
      if (!map[key]) map[key] = { label: key, sum: 0, count: 0 };
      map[key].sum += Number(d.Power_Output_kW) || 0;
      map[key].count++;
    });
    return Object.values(map);
  }, [userData]);

  return (
    <div className="dashboard-wrapper">
      <h3 className="dashboard-header">USER DASHBOARD</h3>

      {/* USER INFO */}
      <div className="grid-2">
        <div className="equal-card blue">
          <p>User ID</p>
          <b>{userInfo.User_ID}</b>
        </div>
        <div className="equal-card green">
          <p>User Name</p>
          <b>{userInfo.User_Name}</b>
        </div>
      </div>

      {/* KPI */}
      <div className="grid-5">
        <div className="equal-card purple">
          <p>Power Input (kW)</p>
          <b>{kpis.powerInput.toFixed(2)}</b>
        </div>
        <div className="equal-card orange">
          <p>Power Output (kW)</p>
          <b>{kpis.powerOutput.toFixed(2)}</b>
        </div>
        <div className="equal-card red">
          <p>Total Turbines</p>
          <b>{Math.round(kpis.turbines)}</b>
        </div>
        <div className="equal-card teal">
          <p>State</p>
          <b>{userInfo.State}</b>
        </div>
        <div className="equal-card indigo">
          <p>City</p>
          <b>{userInfo.City}</b>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid-3">
        <div className="equal-card white">
          <h6>TPC vs Power Loss</h6>
          <Bar
            data={{
              labels: ["Theoretical Power Curve", "Power Loss"],
              datasets: [{
                data: [tpcLoss.tpc, tpcLoss.loss],
                backgroundColor: ["#2563eb", "#ef4444"]
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>

        <div className="equal-card white">
          <h6>Wind Speed Category</h6>
          <Bar
            data={{
              labels: Object.keys(windSpeedMap),
              datasets: [
                {
                  label: "Total Wind Speed (m/s)",
                  data: Object.values(windSpeedMap),
                  backgroundColor: [
                    "#22c55e",
                    "#3b82f6",
                    "#f97316",
                    "#a855f7",
                    "#ef4444"
                  ],
                  borderRadius: 8
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: "y", // ✅ horizontal bar
              scales: {
                x: { beginAtZero: true }
              },
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>
        <div className="equal-card white">
          <h6>Wind Direction vs Turbines</h6>
          <Bar
            data={{
              labels: Object.keys(directionMap),
              datasets: [{
                data: Object.values(directionMap),
                backgroundColor: "#38bdf8"
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>
      </div>

      {/* REDUCED WIDTH CHART */}
      <div className="grid-center">
        <div className="equal-card white medium-width">
          <h6>Avg Power Output by Sector & State</h6>
          <Bar
            data={{
              labels: powerBySectorState.map(d => d.label),
              datasets: [{
                data: powerBySectorState.map(d => d.sum / d.count),
                backgroundColor: "#6366f1"
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
