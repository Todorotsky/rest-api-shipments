import express from "express";
import shipmentRoutes from "./src/routes/shipments";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/shipments", shipmentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
