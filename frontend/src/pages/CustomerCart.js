import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CustomerCart.css";

export default function CustomerCart() {
  const { tableId } = useParams();
  const [cart, setCart] = useState([]);
  const [paid, setPaid] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    const storedCart = localStorage.getItem(`cart-${tableId}`);
    if (storedCart) setCart(JSON.parse(storedCart));
  }, [tableId]);

  const placeOrder = async () => {
    try {
      for (const item of cart) {
        await axios.post(`${API_BASE}/orders/${tableId}`, {
          itemId: item._id,
          quantity: item.quantity,
        });
      }
      alert("Order placed! Now proceed to payment.");
    } catch (err) {
      alert("❌ Failed to place order.");
      console.error(err);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await axios.post(`${API_BASE}/orders/${tableId}/checkout`);
      setTransaction(res.data.order.transactionDetails);
      setPaid(true);
      localStorage.removeItem(`cart-${tableId}`);
    } catch (err) {
      alert("❌ Payment failed.");
      console.error(err);
    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = total * 0.05;
  const grandTotal = total + tax;

  return (
    <div className="cart-view">
      <h2>Your Cart - Table {tableId}</h2>
      {cart.map((item) => (
        <div className="cart-item" key={item._id}>
          {item.name} x {item.quantity} — ₹{item.price * item.quantity}
        </div>
      ))}
      <p>Subtotal: ₹{total.toFixed(2)}</p>
      <p>Tax (5%): ₹{tax.toFixed(2)}</p>
      <p>Total: ₹{grandTotal.toFixed(2)}</p>
      {!paid && (
        <>
          <button onClick={placeOrder}>Place Order</button>
          <button onClick={handlePayment}>Checkout & Pay</button>
          <p>Scan UPI QR to pay:</p>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=demo@upi&pn=QRCafe&am=100"
            alt="Dummy UPI"
            width="200"
          />
        </>
      )}
      {paid && transaction && (
        <div className="receipt">
          <h3>✅ Payment Successful</h3>
          <p>Transaction ID: {transaction.transactionId}</p>
          <p>Paid Amount: ₹{grandTotal.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
