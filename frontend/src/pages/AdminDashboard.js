// ✅ AdminDashboard.js
/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [tables, setTables] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    axios
      .get(`${API_BASE}/tables`)
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Failed to fetch tables:", err));
  }, [API_BASE]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.tableId}>
            Table {table.tableId} -{" "}
            {table.isOccupied ? "🟡 Under Service" : "🟢 Available"}
            <Link to={`/admin/orders/${table.tableId}`}> View Orders </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [tables, setTables] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    axios
      .get(`${API_BASE}/tables`)
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Failed to fetch tables:", err));
  }, [API_BASE]);

  const getStatus = (table) => {
    if (table.isOccupied) return "🟡 Under Service";
    if (!table.isOccupied && table.orders && table.orders.length > 0)
      return "✅ Bill Paid";
    return "🟢 Available";
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.tableId}>
            Table {table.tableId} - {getStatus(table)}{" "}
            <Link to={`/admin/orders/${table.tableId}`}>View Orders</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
