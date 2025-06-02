import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerMenu.css";

export default function CustomerMenu() {
  const { tableId } = useParams();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    axios
      .get(`${API_BASE}/menu`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("❌ Menu fetch error:", err));
  }, [API_BASE]);

  const addToCart = (item) => {
    const exists = cart.find((i) => i._id === item._id);
    if (exists) {
      setCart(
        cart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const goToCart = () => {
    localStorage.setItem(`cart-${tableId}`, JSON.stringify(cart));
    navigate(`/cart/${tableId}`);
  };

  return (
    <div className="menu-view">
      <h2>Menu - Table {tableId}</h2>
      <div className="menu-grid">
        {menu.map((item) => (
          <div className="menu-item" key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>₹{item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <button className="view-cart" onClick={goToCart}>
        Go to Cart
      </button>
    </div>
  );
}
