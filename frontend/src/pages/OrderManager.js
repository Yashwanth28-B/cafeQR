import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function OrderManager() {
  const { tableId } = useParams();
  const [order, setOrder] = useState(null);
  const API_BASE = process.env.REACT_APP_API_BASE;

  const fetchOrder = useCallback(() => {
    axios
      .get(`${API_BASE}/orders/${tableId}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("❌ Failed to fetch order", err));
  }, [API_BASE, tableId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const markDelivered = (index) => {
    axios
      .patch(`${API_BASE}/orders/deliver`, {
        tableId,
        itemIndex: index,
      })
      .then(fetchOrder)
      .catch((err) => console.error("❌ Failed to mark delivered", err));
  };

  const generateBill = () => {
    axios
      .post(`${API_BASE}/orders/${tableId}/checkout`)
      .then((res) =>
        alert(`Bill generated. Total ₹${res.data.order.totalAmount}`)
      )
      .catch((err) => alert("❌ Failed to generate bill"));
  };

  return (
    <div>
      <h2>Orders for Table {tableId}</h2>
      {order ? (
        <>
          <ul>
            {order.items.map((i, idx) => (
              <li key={idx}>
                {i.item?.name} x {i.quantity}
                <input
                  type="checkbox"
                  checked={i.delivered}
                  onChange={() => markDelivered(idx)}
                />{" "}
                Delivered
              </li>
            ))}
          </ul>
          <p>Total: ₹{order.totalAmount || "Pending"}</p>
          <button onClick={generateBill}>Generate Bill</button>
        </>
      ) : (
        <p>No orders yet</p>
      )}
    </div>
  );
}
