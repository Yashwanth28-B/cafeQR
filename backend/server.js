// ✅ server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

/*mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Check and seed only if needed
    seedIfNeeded(); // ← conditionally seeds DB
  })
  .catch((err) => console.error(err));
*/
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/tables", require("./routes/tableRoutes"));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
