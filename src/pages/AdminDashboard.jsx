import { useMemo, useState ,useEffect} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import windSensorData from "../data/windSensorData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [plantId, setPlantId] = useState("ALL");
  const [userId, setUserId] = useState("ALL");

  useEffect(() => {
  if (plantId === "ALL") {
    setUserId("ALL");
  } else {
    // auto-select first user for selected plant
    const usersForPlant = windSensorData
      .filter(d => d.plant_id === plantId)
      .map(d => d.user_id);

    const uniqueSortedUsers = Array.from(new Set(usersForPlant)).sort();

    setUserId(uniqueSortedUsers[0] || "ALL");
  }
}, [plantId]);

useEffect(() => {
  if (userId === "ALL") {
    setPlantId("ALL");
  } else {
    const record = windSensorData.find(d => d.user_id === userId);
    if (record) {
      setPlantId(record.plant_id);
    }
  }
}, [userId]);




  const filtered = useMemo(() => {
    return windSensorData.filter(d => {
      const plantMatch =
        plantId === "ALL" || d.plant_id?.trim() === plantId.trim();

      const userMatch =
        userId === "ALL" || d.user_id === userId;

      return plantMatch && userMatch;
    });
  }, [plantId, userId]);


  const plantOptions = useMemo(
  () => ["ALL", ...new Set(windSensorData.map(d => d.plant_id))],
  []
);

const userOptions = useMemo(() => {
  return [
    "ALL",
    ...Array.from(
      new Set(
        windSensorData
          .filter(d => plantId === "ALL" || d.plant_id === plantId)
          .map(d => d.user_id)
      )
    ).sort()
  ];
}, [plantId]);



  /* ================= CORRECT KPI CALCULATIONS (DATA-BASED) ================= */

  // Total Plants (already correct)
  const totalPlants = new Set(filtered.map(d => d.plant_id)).size;

  // Total Sectors (already correct)
  const totalSectors = new Set(filtered.map(d => d.sector)).size;

  // Total Cost (already correct)
  const totalCost = filtered.reduce(
    (sum, d) => sum + Number(d.total_cost || 0),
    0
  );
  const totalCostInMillions = (totalCost / 1_000_000).toFixed(2);


  // Helper: sum by year (safe & numeric)
  const sumByYearSafe = (key) => {
    const map = {};
    filtered.forEach(d => {
      const year = d.installation_year;
      const value = Number(d[key]) || 0;
      map[year] = (map[year] || 0) + value;
    });
    return map;
  };

  // Product-type sums by year (REAL KEYS FROM DATA)
  const type1ByYear = sumByYearSafe("product_type1_wind_turbine");
  const type2ByYear = sumByYearSafe("product_type2_tower_structure");
  const type3ByYear = sumByYearSafe("product_type3_power_inverter");
  const type4ByYear = sumByYearSafe("product_type4_controller_unit");

  // Final KPI totals (across all years)
  const totalType1 = Object.values(type1ByYear).reduce((a, b) => a + b, 0);
  const totalType2 = Object.values(type2ByYear).reduce((a, b) => a + b, 0);
  const totalType3 = Object.values(type3ByYear).reduce((a, b) => a + b, 0);
  const totalType4 = Object.values(type4ByYear).reduce((a, b) => a + b, 0);

  /* ================= HELPERS ================= */
  const sumByYear = (key) => {
    const map = {};
    filtered.forEach(d => {
      map[d.installation_year] =
        (map[d.installation_year] || 0) + (d[key] || 0);
    });
    return map;
  };

  const countBy = (key) => {
    const map = {};
    filtered.forEach(d => {
      map[d[key]] = (map[d[key]] || 0) + 1;
    });
    return map;
  };

  /* ================= DATA ================= */
  const costByYear = sumByYear("total_cost");
  const productsByInstallType = countBy("installation_type");
  const areaBySector = countBy("sector");

  /* ================= PIE TOOLTIP HELPERS ================= */

  // Get unique years (from filtered data)
  const installationYears = [
    ...new Set(filtered.map(d => d.installation_year))
  ].join(", ");

  // Total areas (for percentage calculation)
  const totalAreaCount = Object.values(areaBySector)
    .reduce((a, b) => a + b, 0);


  /* ================= HORIZONTAL BAR (AREA x INSTALLATION TYPE) ================= */
  const barByArea = useMemo(() => {
    const map = {};

    filtered.forEach(d => {
      if (!map[d.area]) {
        map[d.area] = {};
      }

      map[d.area][d.installation_type] =
        (map[d.area][d.installation_type] || 0) +
        (d.total_num_of_products || 0);
    });

    return map;
  }, [filtered]);

  const AREA_COLORS = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#f59e0b", // orange
    "#ef4444", // red
    "#a855f7", // purple
    "#14b8a6", // teal
  ];


  /* ================= SCATTER BY STATE ================= */
  const scatterByState = useMemo(() => {
    const map = {};

    filtered.forEach(d => {
      if (!map[d.state]) {
        map[d.state] = [];
      }
      map[d.state].push({
        x: d.total_num_of_products,
        y: d.total_cost
      });
    });

    return map;
  }, [filtered]);

  const STATE_COLORS = [
    "#ef4444", // red
    "#3b82f6", // blue
    "#22c55e", // green
    "#f59e0b", // orange
    "#a855f7", // purple
    "#14b8a6", // teal
    "#e11d48", // pink
    "#393a76", // indigo
    "#5d1726",
    "#1b0d27",
  ];


  return (
    <div className="container-fluid dashboard">

      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* FILTER */}
   {/* FILTERS */}
<div className="row mb-4 g-3">

  {/* USER ID */}
  <div className="col-md-4">
    <label className="form-label">Filter by User ID</label>
    <select
      className="form-select"
      value={userId}
      onChange={(e) => setUserId(e.target.value)}
    >
      {userOptions.map(id => (
        <option key={id} value={id}>
          {id === "ALL" ? "All Users" : id}
        </option>
      ))}
    </select>
  </div>

  {/* PLANT ID */}
  <div className="col-md-4">
    <label className="form-label">Filter by Plant ID</label>
    <select
      className="form-select"
      value={plantId}
      onChange={(e) => setPlantId(e.target.value)}
    >
      {plantOptions.map(id => (
        <option key={id} value={id}>
          {id === "ALL" ? "All Plants" : id}
        </option>
      ))}
    </select>
  </div>

</div>


      {/* ================= KPI CARDS ================= */}

      {/* ROW 1 – 4 CARDS */}
      <div className="row g-3 mb-3">

        <div className="col-lg-3 col-md-6">
          <div className="kpi-card kpi-blue">
            <h6>Total Plants</h6>
            <h3>{totalPlants}</h3>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="kpi-card kpi-green">
            <h6>Total Sectors</h6>
            <h3>{totalSectors}</h3>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="kpi-card kpi-orange">
            <h6>Total Investment Cost</h6>
            <h3>₹ {totalCostInMillions} M</h3>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="kpi-card kpi-purple">
            <h6>Wind Turbines (Type 1)</h6>
            <h3>{totalType1.toLocaleString()}</h3>
          </div>
        </div>

      </div>

      {/* ROW 2 – 3 CARDS */}
      <div className="row g-3 mb-5">

        <div className="col-lg-4 col-md-6">
          <div className="kpi-card kpi-teal">
            <h6>Tower Structures (Type 2)</h6>
            <h3>{totalType2.toLocaleString()}</h3>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="kpi-card kpi-red">
            <h6>Power Inverters (Type 3)</h6>
            <h3>{totalType3.toLocaleString()}</h3>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="kpi-card kpi-indigo">
            <h6>Controller Units (Type 4)</h6>
            <h3>{totalType4.toLocaleString()}</h3>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="card table-card mb-5">
        <h5 className="card-title">User & Plant Details</h5>
        <div className="table-wrapper">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Plant</th>
                <th>Sector</th>
                <th>State</th>
                <th>City</th>
                <th>Total Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={i}>
                  <td>{d.user_id}</td>
                  <td>{d.user_name}</td>
                  <td>{d.plant_name}</td>
                  <td>{d.sector}</td>
                  <td>{d.state}</td>
                  <td>{d.city}</td>
                  <td>{d.total_cost?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LINE & SCATTER */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="chart-card">
            <h5>Total Cost by Installation Year</h5>
            <Line
              data={{
                labels: Object.keys(costByYear),
                datasets: [{
                  label: "Total Cost",
                  data: Object.values(costByYear),
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59,130,246,0.3)",
                  tension: 0.4
                }]
              }}
              options={{
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Installation Year"
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Total Cost (₹ in Billions)"
                    },
                    ticks: {
                      callback: (value) => `${value / 1_000_000_000} Bn`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="chart-card">
            <h5>Products vs Total Cost</h5>
            <Scatter
              data={{
                datasets: Object.keys(scatterByState).map((state, index) => ({
                  label: state,
                  data: scatterByState[state].map(point => ({
                    x: point.x,   // total_num_of_products (UNITS)
                    y: point.y,   // total_cost
                    state
                  })),
                  backgroundColor: STATE_COLORS[index % STATE_COLORS.length]
                }))
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom"
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const { x, y, state } = context.raw;

                        return [
                          `State: ${state}`,
                          `Total Products: ${x.toLocaleString()}`,
                          `Total Cost: ₹ ${y.toLocaleString()}`
                        ];
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Total Number of Products (Units)"
                    },
                    ticks: {
                      callback: (value) => value.toLocaleString() // ✅ UNITS ONLY
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Total Cost (₹ in Millions)"
                    },
                    ticks: {
                      callback: (value) => `${value / 1_000_000}M`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* BAR & PIE */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="chart-card">
            <h5>Installation Type Distribution</h5>
            <Bar
              data={{
                labels: [
                  ...new Set(filtered.map(d => d.installation_type))
                ],
                datasets: Object.keys(barByArea).map((area, index) => ({
                  label: area,
                  data: [
                    ...new Set(filtered.map(d => d.installation_type))
                  ].map(type => barByArea[area][type] || 0),
                  backgroundColor: AREA_COLORS[index % AREA_COLORS.length]
                }))
              }}
              options={{
                indexAxis: "y", // 🔥 makes it horizontal
                plugins: {
                  legend: {
                    position: "bottom"
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Total Number of Products"
                    },
                    beginAtZero: true
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Installation Type"
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="col-md-6 ">
          <div className="chart-card ">
            <h5>Sector-wise Area Distribution</h5>
            <Pie
              data={{
                labels: Object.keys(areaBySector),
                datasets: [{
                  data: Object.values(areaBySector),
                  backgroundColor: [
                    "#3b82f6",
                    "#22c55e",
                    "#f59e0b",
                    "#d11111",
                    "#d111bb"
                  ]
                }]
              }}
              options={{
                layout: {
                  padding: {
                    bottom: 20
                  }
                },
                plugins: {
                  legend: {
                    position: "bottom",
                    align: "center",
                    labels: {
                      usePointStyle: true,
                      boxWidth: 10,
                      padding: 20,
                      font: {
                        size: 12
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const sector = context.label;
                        const value = context.raw;
                        const percentage = (
                          (value / totalAreaCount) * 100
                        ).toFixed(2);

                        return [
                          `Sector: ${sector}`,
                          `Area Count: ${value}`,
                          `Year(s): ${installationYears}`,
                          `Percentage: ${percentage}%`
                        ];
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
