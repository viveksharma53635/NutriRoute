import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function Dashboard() {

  const [data, setData] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {

    axios.get("/api/admin/dashboard/analytics")
      .then(res => setData(res.data));

  }, []);
  useEffect(() => {

  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    navigate("/login");
  }

}, []);

  if (!data) return <p>Loading...</p>;

  return (

    <div>

      <h2>Analytics Dashboard</h2>

      <div className="stats">

        <div>Total Users: {data.totalUsers}</div>

        <div>Active Users: {data.activeUsers}</div>

        <div>New Users Today: {data.todayUsers}</div>

      </div>

      <LineChart
        width={600}
        height={300}
        data={data.registrations}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>

    </div>
  );
}