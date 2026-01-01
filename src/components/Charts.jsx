// components/Charts.jsx
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip } from "recharts";


const Charts = ({ data }) => (
<BarChart width={400} height={300} data={data}>
<XAxis dataKey="month" />
<YAxis />
<Tooltip />
<Bar dataKey="power" fill="#28a745" />
</BarChart>
);
export default Charts;