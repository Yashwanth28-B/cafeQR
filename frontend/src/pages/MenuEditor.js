import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MenuEditor() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    imageUrl: "",
    stock: 0,
  });

  const API_BASE = process.env.REACT_APP_API_BASE;

  const fetchMenu = () =>
    axios.get(`${API_BASE}/menu`).then((res) => setMenu(res.data));

  useEffect(() => {
    axios
      .get(`${API_BASE}/menu`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("Error fetching menu:", err));
  }, [API_BASE]);

  const handleAdd = async () => {
    await axios.post(`${API_BASE}/menu`, form);
    fetchMenu();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/menu/${id}`);
    fetchMenu();
  };

  return (
    <div>
      <h2>Edit Menu</h2>
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Price"
        type="number"
        onChange={(e) =>
          setForm({ ...form, price: parseFloat(e.target.value) })
        }
      />
      <input
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        placeholder="Image URL"
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
      />
      <input
        placeholder="Stock"
        type="number"
        onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
      />
      <input
        placeholder="Category"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <button onClick={handleAdd}>Add Item</button>

      <ul>
        {menu.map((item) => (
          <li key={item._id}>
            {item.name} - ₹{item.price}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
