// components/EnergyCard.jsx
const EnergyCard = ({ title, desc }) => (
<div className="col-md-3">
<div className="card shadow-lg energy-card">
<div className="card-body text-center">
<h4 className="fw-bold">{title}</h4>
<p>{desc}</p>
</div>
</div>
</div>
);
export default EnergyCard;