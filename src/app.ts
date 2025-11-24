import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { locationRoutes, productRoutes } from "./routes";
import { connectDB } from "./config/database";
import { swaggerSpec } from "./config/swagger";
import "./models/location.model";
import "./models/product.model";
import { sequelize } from "./config/database";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_, res) => {
	res.status(200).json({
		status: "OK",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

app.get("/api", (_, res) => {
	res.status(200).json({ message: "Cavea Server API is running!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/products", productRoutes.default);
app.use("/locations", locationRoutes.default);

app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

connectDB();

sequelize.sync({ alter: true }).then(() => {
	console.log("✅ Tables synchronized");
});

export default app;
