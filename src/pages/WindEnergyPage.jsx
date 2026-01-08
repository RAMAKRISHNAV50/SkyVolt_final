import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

/**
 * Notes:
 * - The comparison numbers below are typical/approximate (for UI + demo).
 * - For your real app, connect these to your admin-entered product data (capex/opex/tariff/etc).
 */
const ENERGY = [
  {
    key: "wind",
    name: "Wind",
    badge: "Best long-term profit",
    capexPerMW: 6.5, // ₹ Crore per MW (approx)
    opexPerMWPerYear: 0.28, // ₹ Crore / MW / year
    capacityFactor: 0.35, // 35%
    co2KgPerKWh: 0.012,
    pros: ["Low operating cost", "Scalable", "No fuel", "Fast to deploy"],
    cons: ["Needs good wind site", "Output varies with wind"]
  },
  {
    key: "solar",
    name: "Solar",
    badge: "Great for daytime",
    capexPerMW: 4.0,
    opexPerMWPerYear: 0.18,
    capacityFactor: 0.22,
    co2KgPerKWh: 0.04,
    pros: ["Cheaper capex", "Easy maintenance", "Quick installation"],
    cons: ["Lower night output", "Needs land area"]
  },
  {
    key: "coal",
    name: "Coal",
    badge: "High emissions",
    capexPerMW: 9.0,
    opexPerMWPerYear: 1.8,
    capacityFactor: 0.65,
    co2KgPerKWh: 0.82,
    pros: ["Stable output (base load)"],
    cons: ["Fuel cost", "High emissions", "More maintenance"]
  },
  {
    key: "gas",
    name: "Gas",
    badge: "Flexible, but fuel cost",
    capexPerMW: 6.0,
    opexPerMWPerYear: 1.1,
    capacityFactor: 0.55,
    co2KgPerKWh: 0.49,
    pros: ["Fast ramp-up", "Reliable"],
    cons: ["Fuel price risk", "CO₂ emissions"]
  },
  {
    key: "hydro",
    name: "Hydro",
    badge: "Site dependent",
    capexPerMW: 10.0,
    opexPerMWPerYear: 0.35,
    capacityFactor: 0.45,
    co2KgPerKWh: 0.02,
    pros: ["Long life", "Low operating cost"],
    cons: ["High upfront cost", "Needs suitable location"]
  }
];

function formatCr(n) {
  // n in ₹ Crore
  return `₹ ${n.toFixed(2)} Cr`;
}

function formatINR(n) {
  // n in ₹
  return `₹ ${Math.round(n).toLocaleString("en-IN")}`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const TurbineSVG = () => (
  <svg viewBox="0 0 560 260" className="w-100 h-auto">
    <defs>
      <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e0f2fe" />
        <stop offset="1" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id="gTower" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#e5e7eb" />
        <stop offset="1" stopColor="#cbd5e1" />
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="560" height="260" fill="url(#gSky)" rx="18" />
    {/* ground */}
    <rect x="0" y="210" width="560" height="50" fill="#dcfce7" rx="18" />

    {/* turbine tower */}
    <path
      d="M280 60 L300 210 L260 210 Z"
      fill="url(#gTower)"
      stroke="#94a3b8"
      strokeWidth="2"
    />

    {/* nacelle */}
    <rect x="265" y="45" width="60" height="18" rx="6" fill="#cbd5e1" stroke="#94a3b8" />
    <circle cx="265" cy="54" r="8" fill="#94a3b8" />

    {/* blades */}
    <g transform="translate(265 54)">
      <path d="M0 0 L-90 -25 L-80 -35 Z" fill="#e2e8f0" stroke="#94a3b8" />
      <path d="M0 0 L-40 80 L-55 78 Z" fill="#e2e8f0" stroke="#94a3b8" />
      <path d="M0 0 L60 -70 L70 -55 Z" fill="#e2e8f0" stroke="#94a3b8" />
      <circle cx="0" cy="0" r="6" fill="#64748b" />
    </g>

    {/* labels */}
    <g fontFamily="ui-sans-serif, system-ui" fontSize="12" fill="#0f172a">
      <text x="32" y="52">Rotor Blades</text>
      <line x1="110" y1="56" x2="190" y2="56" stroke="#0f172a" strokeWidth="1" />
      <circle cx="190" cy="56" r="3" fill="#0f172a" />

      <text x="360" y="58">Nacelle (Gearbox + Generator)</text>
      <line x1="350" y1="60" x2="325" y2="60" stroke="#0f172a" strokeWidth="1" />
      <circle cx="325" cy="60" r="3" fill="#0f172a" />

      <text x="40" y="170">Tower</text>
      <line x1="82" y1="172" x2="250" y2="190" stroke="#0f172a" strokeWidth="1" />
      <circle cx="250" cy="190" r="3" fill="#0f172a" />

      <text x="360" y="205">Foundation</text>
      <line x1="430" y1="205" x2="295" y2="210" stroke="#0f172a" strokeWidth="1" />
      <circle cx="295" cy="210" r="3" fill="#0f172a" />
    </g>
  </svg>
);

const FlowSVG = () => (
  <svg viewBox="0 0 860 220" className="w-100 h-auto">
    <rect x="0" y="0" width="860" height="220" fill="#fff" rx="18" />
    <g fontFamily="ui-sans-serif, system-ui" fontSize="13" fill="#0f172a">
      {[
        { x: 30, y: 60, t: "Wind", s: "Kinetic energy in air" },
        { x: 230, y: 60, t: "Rotor", s: "Blades spin shaft" },
        { x: 430, y: 60, t: "Generator", s: "Mechanical → Electrical" },
        { x: 630, y: 60, t: "Transformer", s: "Voltage step-up" },
        { x: 760, y: 60, t: "Grid/Load", s: "Homes & industries" }
      ].map((b, i) => (
        <g key={b.t}>
          <rect x={b.x} y={b.y} width="150" height="80" rx="14" fill="#f1f5f9" stroke="#cbd5e1" />
          <text x={b.x + 12} y={b.y + 28} fontWeight="700">{b.t}</text>
          <text x={b.x + 12} y={b.y + 52} fill="#334155">{b.s}</text>
          {i < 4 && (
            <>
              <line x1={b.x + 150} y1={b.y + 40} x2={b.x + 190} y2={b.y + 40} stroke="#0f172a" />
              <polygon points={`${b.x + 190},${b.y + 40} ${b.x + 180},${b.y + 34} ${b.x + 180},${b.y + 46}`} fill="#0f172a" />
            </>
          )}
        </g>
      ))}
    </g>
  </svg>
);

function computeFinance(item, mw, tariffPerKwh, years = 1) {
  const hours = 8760;
  const annualKwh = mw * 1000 * hours * item.capacityFactor; // MW -> kW
  const revenue = annualKwh * tariffPerKwh; // ₹
  const opex = item.opexPerMWPerYear * mw * 1e7; // ₹ (Crore to ₹)
  const capex = item.capexPerMW * mw * 1e7; // ₹
  const profit = revenue - opex; // simplistic
  const paybackYears = profit > 0 ? capex / profit : Infinity;

  return {
    annualKwh,
    revenue,
    opex,
    capex,
    profit,
    paybackYears,
    co2Kg: annualKwh * item.co2KgPerKWh * years
  };
}

const StatPill = ({ label, value, hint }) => (
  <div className="rounded-3 border bg-white p-3 shadow-sm h-100">
    <div className="text-muted small">{label}</div>
    <div className="fs-5 fw-bold">{value}</div>
    {hint ? <div className="text-muted small mt-1">{hint}</div> : null}
  </div>
);

export default function WindEnergyPage() {
  const [left, setLeft] = useState("wind");
  const [right, setRight] = useState("solar");
  const [mw, setMw] = useState(5); // plant size
  const [tariff, setTariff] = useState(5.5); // ₹ / kWh
  const navigate = useNavigate();
  

const downloadWindReport = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Wind Energy Report", 14, 20);

  // Table
  autoTable(doc, {
    startY: 35,
    head: [["Parameter", "Details"]],
    body: [
      ["Energy Type", "Wind Energy"],
      ["Capacity Factor", "35%"],
      ["CAPEX", "₹ 6.5 Crore / MW"],
      ["OPEX", "₹ 0.28 Crore / MW / Year"],
      ["Fuel Cost", "Nil (Wind is free)"],
      ["Plant Life", "20–25 Years"],
      ["CO₂ Emissions", "Very Low"]
    ]
  });

  doc.save("Wind_Energy_Report.pdf");
};


  const leftItem = ENERGY.find((e) => e.key === left) || ENERGY[0];
  const rightItem = ENERGY.find((e) => e.key === right) || ENERGY[1];

  const leftCalc = useMemo(() => computeFinance(leftItem, mw, tariff), [leftItem, mw, tariff]);
  const rightCalc = useMemo(() => computeFinance(rightItem, mw, tariff), [rightItem, mw, tariff]);

  const profitChart = useMemo(() => {
    const labels = ["Annual Revenue", "Annual OPEX", "Annual Profit", "CAPEX (One-time)"];


    return {
      labels,
      datasets: [
        {
          label: leftItem.name,
          data: [
            leftCalc.revenue / 1e7,
            leftCalc.opex / 1e7,
            leftCalc.profit / 1e7,
            leftCalc.capex / 1e7
          ],
          backgroundColor: [
            "rgba(34,197,94,0.85)",   // Revenue - Green
            "rgba(239,68,68,0.85)",   // OPEX - Red
            "rgba(59,130,246,0.85)",  // Profit - Blue
            "rgba(168,85,247,0.85)"   // CAPEX - Purple
          ],
          borderRadius: 10,
          barThickness: 34
        },
        {
          label: rightItem.name,
          data: [
            rightCalc.revenue / 1e7,
            rightCalc.opex / 1e7,
            rightCalc.profit / 1e7,
            rightCalc.capex / 1e7
          ],
          backgroundColor: [
            "rgba(22,163,74,0.55)",
            "rgba(220,38,38,0.55)",
            "rgba(37,99,235,0.55)",
            "rgba(147,51,234,0.55)"
          ],
          borderRadius: 10,
          barThickness: 34
        }
      ]
    };
  }, [leftItem.name, rightItem.name, leftCalc, rightCalc]);


  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 14,
            padding: 18,
            font: { size: 13, weight: "600" }
          }
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#ffffff",
          bodyColor: "#e5e7eb",
          borderColor: "#22c55e",
          borderWidth: 1,
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ₹ ${ctx.parsed.y.toFixed(2)} Cr`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { weight: "600" } }
        },
        y: {
          grid: {
            color: "rgba(15,23,42,0.08)"
          },
          title: {
            display: true,
            text: "₹ Crore (Approx)",
            font: { weight: "600" }
          }
        }
      },
      hover: {
        mode: "index",
        intersect: false
      }
    }),
    []
  );


  const better = leftCalc.profit > rightCalc.profit ? leftItem : rightItem;
  const profitGapCr = Math.abs(leftCalc.profit - rightCalc.profit) / 1e7;

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="container py-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div className="d-inline-flex align-items-center gap-2 rounded-pill border bg-white px-3 py-2 shadow-sm">
              <span className="badge text-bg-success">Clean Energy</span>
              <span className="text-muted small">Lower operating cost • Long-term profit</span>
            </div>

            <h1 className="mt-3 fw-bold display-5">
              Why <span className="text-success">Wind Energy</span>?
            </h1>

            <p className="mt-3 text-muted fs-5">
              Wind energy converts the natural movement of air into electricity using wind turbines.
              It’s one of the most practical renewable options because it has <b>no fuel cost</b>,
              <b> low maintenance</b>, and <b>strong long-term returns</b> when installed at a good wind site.
            </p>

            <div className="mt-4 d-flex flex-wrap gap-2">
              <span className="badge rounded-pill text-bg-light border">No fuel needed</span>
              <span className="badge rounded-pill text-bg-light border">Scalable (1 turbine → wind farm)</span>
              <span className="badge rounded-pill text-bg-light border">Low CO₂ emissions</span>
              <span className="badge rounded-pill text-bg-light border">Stable returns over life</span>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="rounded-4 bg-white border shadow-sm p-3">
              <TurbineSVG />
              <div className="mt-2 text-muted small">
                Image: Wind turbine parts (inline SVG). You can replace with real images later.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY WIND IS BEST */}
      <section className="container pb-5">
        <div className="rounded-4 border bg-white shadow-sm p-4">
          <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
            <div>
              <h2 className="fw-bold">Why wind is often better than other power sources</h2>
              <p className="text-muted mb-0">
                Wind becomes attractive mainly because after installation, the main “fuel” is free. This usually
                improves profit over the system lifetime.
              </p>
            </div>
            <span className="badge text-bg-success align-self-start">High ROI potential</span>
          </div>

          <div className="row g-3 mt-3">
            {[
              {
                title: "Lower operating cost",
                text: "No fuel purchases. OPEX is mainly servicing, monitoring, and minor repairs."
              },
              {
                title: "Long asset life",
                text: "Turbines are designed for long service life; returns improve over time."
              },
              {
                title: "Cleaner energy",
                text: "Very low CO₂ emissions per kWh compared to fossil-fuel sources."
              },
              {
                title: "Great for hybrid systems",
                text: "Wind + Solar + Storage can improve reliability and reduce grid dependence."
              }
            ].map((c) => (
              <div className="col-md-6 col-lg-3" key={c.title}>
                <div className="h-100 rounded-4 border bg-white p-3 shadow-sm">
                  <div className="fw-bold">{c.title}</div>
                  <div className="text-muted mt-1">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container pb-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="rounded-4 border bg-white shadow-sm p-4 h-100">
              <h2 className="fw-bold">How wind energy works</h2>
              <p className="text-muted">
                Wind turns the rotor blades → shaft rotates → generator produces electricity → transformer steps up voltage →
                power is sent to the grid or used on-site.
              </p>
              <div className="mt-3 rounded-4 border p-3 bg-white">
                <FlowSVG />
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="rounded-4 border bg-white shadow-sm p-4 h-100">
              <h2 className="fw-bold">Main parts of a wind turbine</h2>

              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item">
                  <b>Rotor Blades</b> – capture wind energy and rotate.
                </li>
                <li className="list-group-item">
                  <b>Hub</b> – connects blades to the main shaft.
                </li>
                <li className="list-group-item">
                  <b>Nacelle</b> – housing for gearbox, generator, brake, controller.
                </li>
                <li className="list-group-item">
                  <b>Gearbox</b> (in many turbines) – increases rotational speed for the generator.
                </li>
                <li className="list-group-item">
                  <b>Generator</b> – converts mechanical energy into electrical energy.
                </li>
                <li className="list-group-item">
                  <b>Yaw system</b> – turns the turbine to face the wind direction.
                </li>
                <li className="list-group-item">
                  <b>Tower + Foundation</b> – structural support and stability.
                </li>
                <li className="list-group-item">
                  <b>Transformer</b> – steps up voltage for efficient transmission.
                </li>
              </ul>

              <div className="alert alert-success mt-3 mb-0">
                <b>Simple idea:</b> wind is free fuel → after installation, you mainly manage maintenance → profit improves.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container pb-5">
        <div className="rounded-4 border bg-white shadow-sm p-4">
          <h2 className="fw-bold">Benefits of wind energy</h2>
          <div className="row g-3 mt-2">
            {[
              { t: "Cost-effective over time", d: "No fuel costs. OPEX is relatively low compared to thermal plants." },
              { t: "Eco-friendly", d: "Very low emissions during operation, helping sustainability goals." },
              { t: "Energy independence", d: "Reduces dependency on fuel imports and price changes." },
              { t: "Job creation", d: "Creates jobs in installation, operations, maintenance, and supply chain." },
              { t: "Land co-usage", d: "Farms can continue beneath turbines (agriculture + power together)." },
              { t: "Scalable & modular", d: "Start small and expand by adding more turbines." }
            ].map((x) => (
              <div className="col-md-6 col-lg-4" key={x.t}>
                <div className="h-100 rounded-4 border bg-white p-3 shadow-sm">
                  <div className="fw-bold">{x.t}</div>
                  <div className="text-muted mt-1">{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TOOL */}
      <section className="container pb-5">
        <div className="rounded-4 border bg-white shadow-sm p-4">
          <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1">Compare power sources (Cost & Profit)</h2>
              <div className="text-muted">
                Select any two options. This shows an estimated yearly profit based on plant size and tariff.
              </div>
            </div>
            <span className="badge text-bg-primary align-self-start">Interactive</span>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-lg-4">
              <div className="rounded-4 border p-3 bg-white shadow-sm h-100">
                <div className="fw-bold mb-2">Inputs</div>

                <label className="form-label mb-1">Plant size (MW): {mw}</label>
                <input
                  className="form-range"
                  type="range"
                  min={1}
                  max={50}
                  value={mw}
                  onChange={(e) => setMw(clamp(Number(e.target.value), 1, 50))}
                />

                <label className="form-label mb-1 mt-2">Tariff (₹ / kWh): {tariff.toFixed(1)}</label>
                <input
                  className="form-range"
                  type="range"
                  min={2}
                  max={10}
                  step={0.1}
                  value={tariff}
                  onChange={(e) => setTariff(clamp(Number(e.target.value), 2, 10))}
                />

                <div className="row g-2 mt-2">
                  <div className="col-12">
                    <label className="form-label mb-1">Option A</label>
                    <select className="form-select" value={left} onChange={(e) => setLeft(e.target.value)}>
                      {ENERGY.map((e) => (
                        <option key={e.key} value={e.key}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label mb-1 mt-2">Option B</label>
                    <select className="form-select" value={right} onChange={(e) => setRight(e.target.value)}>
                      {ENERGY.map((e) => (
                        <option key={e.key} value={e.key}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="alert alert-warning mt-3 mb-0">
                  <b>Tip:</b> For your real system, replace these sample costs with your admin-entered costs
                  (turbine price, installation, maintenance, etc.).
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="rounded-4 border p-3 bg-white shadow-sm">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="rounded-4 border p-3 h-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-bold">{leftItem.name}</div>
                        <span className="badge text-bg-success">{leftItem.badge}</span>
                      </div>

                      <div className="row g-2 mt-2">
                        <div className="col-6">
                          <StatPill label="CAPEX" value={formatCr((leftItem.capexPerMW * mw))} hint="One-time" />
                        </div>
                        <div className="col-6">
                          <StatPill
                            label="Annual OPEX"
                            value={formatCr(leftItem.opexPerMWPerYear * mw)}
                            hint="Maintenance/ops"
                          />
                        </div>
                        <div className="col-6">
                          <StatPill
                            label="Annual Revenue"
                            value={formatINR(leftCalc.revenue)}
                            hint="Based on tariff"
                          />
                        </div>
                        <div className="col-6">
                          <StatPill
                            label="Annual Profit"
                            value={formatINR(leftCalc.profit)}
                            hint={`Payback ~ ${Number.isFinite(leftCalc.paybackYears) ? leftCalc.paybackYears.toFixed(1) : "N/A"} yrs`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="rounded-4 border p-3 h-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-bold">{rightItem.name}</div>
                        <span className="badge text-bg-secondary">{rightItem.badge}</span>
                      </div>

                      <div className="row g-2 mt-2">
                        <div className="col-6">
                          <StatPill label="CAPEX" value={formatCr((rightItem.capexPerMW * mw))} hint="One-time" />
                        </div>
                        <div className="col-6">
                          <StatPill
                            label="Annual OPEX"
                            value={formatCr(rightItem.opexPerMWPerYear * mw)}
                            hint="Maintenance/ops"
                          />
                        </div>
                        <div className="col-6">
                          <StatPill
                            label="Annual Revenue"
                            value={formatINR(rightCalc.revenue)}
                            hint="Based on tariff"
                          />
                        </div>
                        <div className="col-6">
                          <StatPill
                            label="Annual Profit"
                            value={formatINR(rightCalc.profit)}
                            hint={`Payback ~ ${Number.isFinite(rightCalc.paybackYears) ? rightCalc.paybackYears.toFixed(1) : "N/A"} yrs`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-3 rounded-4 p-4 chart-card">
                  <div className="fw-bold text-center mb-3 chart-title">
                    Profit Comparison (₹ Crore)
                  </div>

                  <div style={{ height: "360px" }}>
                    <Bar data={profitChart} options={chartOptions} />
                  </div>

                  <div className="text-muted small mt-2 text-center">
                    Color-coded comparison of revenue, cost, profit & capital investment
                  </div>


                  <div className="text-muted small mt-2">
                    Chart shows approximate yearly values (revenue/opex/profit) and one-time CAPEX for the selected plant size.
                  </div>
                </div>

                {/* Below chart explanation */}
                <div className="mt-3 rounded-4 border p-3 bg-success-subtle">
                  <div className="fw-bold">
                    Result: {better.name} gives higher yearly profit (approx)
                  </div>
                  <div className="mt-1">
                    Profit difference is about <b>₹ {profitGapCr.toFixed(2)} Cr / year</b> for a {mw} MW plant at ₹ {tariff.toFixed(1)}/kWh tariff.
                    <br />
                    <span className="text-muted">
                      Wind often wins because after installation, the major running cost is low (no fuel). Over the lifetime,
                      this increases net profit, especially in good wind locations.
                    </span>
                  </div>

                  <div className="mt-2 text-muted small">
                    Real profits depend on wind resource, turbine selection, land, grid availability, downtime, financing, and policy/tariff.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extra content: why wind gives more profit */}
          <div className="mt-4">
            <h3 className="fw-bold">Why installing wind can give more profit than many other options</h3>
            <ul className="text-muted">
              <li>
                <b>No fuel expense:</b> Fossil plants spend money daily on fuel. Wind uses free natural wind.
              </li>
              <li>
                <b>Predictable operating cost:</b> OPEX is mostly maintenance, monitoring, and periodic servicing.
              </li>
              <li>
                <b>Better lifetime economics:</b> Even if CAPEX is higher than solar, wind can generate strong energy output at good sites.
              </li>
              <li>
                <b>Scalable growth:</b> You can add turbines over time and increase revenue gradually.
              </li>
              <li>
                <b>Cleaner brand value:</b> Many companies prefer clean energy, improving business value and compliance.
              </li>
            </ul>
          </div>
        </div>
      </section >

      {/* FOOTER CTA */}
      <section className="container pb-5">
        <div className="rounded-4 border bg-white shadow-sm p-4 d-flex align-items-center justify-content-between flex-wrap gap-3 cta-card">

          <div>
            <div className="fw-bold fs-4">
              Ready to move from learning to action?
            </div>
            <div className="text-muted mt-1">
              You’ve explored how wind energy works, its benefits, costs, and profit potential.
              Now you can <b>explore our wind energy products</b> or
              <b> download a detailed report</b> for future reference.
            </div>
          </div>

          <div className="d-flex gap-2">
            {/* Navigate to Products */}
            <button
              className="btn btn-success px-4 py-2 fw-semibold"
              onClick={() => navigate("/products")}

            >
              Explore Wind Products
            </button>

            {/* Download PDF */}
            <button
              className="btn btn-outline-secondary px-4 py-2 fw-semibold"
              onClick={downloadWindReport}
            >
              Download Report (PDF)
            </button>

          </div>

        </div>
      </section>


      {/* Tailwind background helper (optional) */}
      < style > {`
        .bg-slate-50 { background: #f8fafc; }
      `}</style >
    </div >
  );
}
