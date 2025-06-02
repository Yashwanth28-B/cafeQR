// src/pages/MenuView.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function MenuView() {
  const { tableId } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menu")
      .then((res) => setMenu(res.data));
  }, []);

  return (
    <div className="menu-container">
      <h2>Table {tableId} Menu</h2>
      <ul>
        {menu.map((item) => (
          <li key={item._id}>
            <h4>
              {item.name} - ₹{item.price}
            </h4>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
      <Link to={`/cart/${tableId}`}>Go to Cart</Link>
    </div>
  );
}
