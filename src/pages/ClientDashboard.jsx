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

/* ================= REGISTER ================= */
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

  /* ================= KPI ================= */
  /* ================= KPI ================= */
  const kpis = useMemo(() => {
    const powerPerTurbine =
      userData.reduce((s, d) => s + (+d["power_per_turbine(KW)"] || 0), 0);

    const installationCost =
      userData.reduce((s, d) => s + (+d.installation_price_lakhs || 0), 0);

    const totalPower =
      userData.reduce((s, d) => s + (+d.Power_Output_kW || 0), 0);

    const totalPowerValueRupees = totalPower * 3.44; // ✅ ₹ per kW

    return {
      powerPerTurbine,
      totalPower,
      totalTurbines: userData.reduce((s, d) => s + (+d.no_turbine || 0), 0),
      installationCost,
      totalPowerValueRupees // ✅ NEW KPI
    };
  }, [userData]);


  /* ================= GAUGE VALUES ================= */
  const avgGeneratorRPM = useMemo(() => {
    if (!userData.length) return 0;
    return Math.round(userData.reduce((s, d) => s + (+d.Generator_Speed_RPM || 0), 0) / userData.length);
  }, [userData]);

  const avgWindSpeed = useMemo(() => {
    if (!userData.length) return 0;
    return +(
      userData.reduce((s, d) => s + (+d["Wind_Speed (m/s)"] || 0), 0) /
      userData.length
    ).toFixed(1);
  }, [userData]);

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
  const avgPowerBySector = useMemo(() => {
    const map = {};
    userData.forEach(d => {
      const s = d.Sector || "Unknown";
      const p = +d.Power_Output_kW || 0;
      if (!map[s]) map[s] = { sum: 0, count: 0 };
      map[s].sum += p;
      map[s].count++;
    });
    return Object.entries(map).map(([sector, v]) => ({
      sector,
      avg: v.sum / v.count
    }));
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
      plantNames: [...d.plants].join(", ")
    }));
  }, [userData]);
  /* ================= DASHBOARD TITLE ================= */
  const dashboardTitle = useMemo(() => {
    if (!userData.length) return "Dashboard";
    return `${userData[0].User_Name} Dashboard`;
  }, [userData]);


  /* ================= GAUGE ================= */
  const Gauge = ({ value, max, label, unit, color }) => (
    <>
      <h6 className="text-center mb-2">{label}</h6>

      <div style={{ flex: 1, position: "relative" }}>
        <Doughnut
          data={{
            datasets: [
              {
                data: [value, Math.max(max - value, 0)],
                backgroundColor: [color, "#e5e7eb"],
                borderWidth: 0,
                cutout: "65%"
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            circumference: 180,
            rotation: 270,
            plugins: { legend: { display: false } }
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: 600
          }}
        >
          {value} {unit}
        </div>
      </div>
    </>
  );


  return (
    <div className="dashboard-wrapper">
      <h3 className="dashboard-header">{dashboardTitle}</h3>


      <div className="grid-5">
        <div className="equal-card purple">
          <p>Power (per single Turbine)KW</p>
          <b>{kpis.powerPerTurbine.toFixed(2)}</b>
        </div>

        <div className="equal-card orange">
          <p>Total Power(all turbines)KW</p>
          <b>{kpis.totalPower.toFixed(2)} </b>
        </div>

        <div className="equal-card red">
          <p>Total Turbines</p>
          <b>{kpis.totalTurbines}</b>
        </div>

        {/* ✅ NEW KPI CARD */}
        <div className="equal-card green">
          <p>Installation Cost (₹ Lakhs)</p>
          <b>₹ {kpis.installationCost.toFixed(2)}</b>
        </div>

        <div className="equal-card blue">
          <p>Total Power Value (₹ @ 3.44/kW)</p>
          <b>₹ {kpis.totalPowerValueRupees.toFixed(2)}</b>
        </div>


      </div>
      {/* ================= ROW 1 ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 20,
          marginTop: 20
        }}
      >
        {/* LINE CHART */}
        <div className="equal-card white equal-height-card">
          <h6>TPC & Power Loss by Sector</h6>

          <div style={{ flex: 1 }}>
            <Line
              data={{
                labels: Object.keys(tpcLossBySector),
                datasets: [
                  {
                    label: "TPC",
                    data: Object.values(tpcLossBySector).map(d => d.tpc),
                    borderColor: "#2563eb"
                  },
                  {
                    label: "Loss",
                    data: Object.values(tpcLossBySector).map(d => d.loss),
                    borderColor: "#ef4444"
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>

        {/* GAUGE 1 */}
        <div className="equal-card white equal-height-card">
          <Gauge
            label="Avg Generator Speed"
            value={avgGeneratorRPM}
            max={2000}
            unit="RPM"
            color="#22c55e"
          />
        </div>

        {/* GAUGE 2 */}
        <div className="equal-card white equal-height-card">
          <Gauge
            label="Avg Wind Speed"
            value={avgWindSpeed}
            max={30}
            unit="m/s"
            color="#2563eb"
          />
        </div>
      </div>

      {/* ================= ROW 2 ================= */}
      <div className="equal-card white" style={{ marginTop: 20, padding: 12 }}>
        <h6>User – Plant Details</h6>

        <table className="table table-bordered table-sm mb-0">
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
      {/* ================= ROW 3 ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 20
        }}
      >
        <div className="equal-card white">
          <h6>Avg Power Output by Sector</h6>
          <Bar
            data={{
              labels: avgPowerBySector.map(d => d.sector),
              datasets: [
                {
                  label: "Avg Power (kW)",
                  data: avgPowerBySector.map(d => d.avg),
                  backgroundColor: "#22c55e"
                }
              ]
            }}
          />
        </div>

        <div className="equal-card white">
          <h6>Wind Direction vs Turbines</h6>
          <Bar
            data={{
              labels: Object.keys(windDirectionTurbines),
              datasets: [
                {
                  label: "Turbines",
                  data: Object.values(windDirectionTurbines),
                  backgroundColor: "#38bdf8"
                }
              ]
            }}
          />
        </div>
      </div>



    </div>
  );
};

export default ClientDashboard;
