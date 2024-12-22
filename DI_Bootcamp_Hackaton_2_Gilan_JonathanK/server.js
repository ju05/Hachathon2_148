import express from "express";
import { createEnemiesTable, db } from './dbConnection/database.js';
import cors from "cors";
import { catRouter } from './routes/catRouter.js';
import playerRoutes from "./routes/playerRoute.js";
import enemyRoutes from "./routes/enemyRoute.js";
import path from "path";
import bp from 'body-parser'

const PORT = 5000;

const app = express();
app.use(cors());
app.use("/", express.static(path.join(path.resolve(), "public")));
// app.use(express.json());
app.use(bp.json());
app.use(bp.urlencoded({extended:false}));
app.use("/players", playerRoutes);
app.use("/enemies", enemyRoutes);
app.use("/categories",catRouter)


// Health Check Endpoint
app.get("/healthcheck", (req, res) => {
    res.status(200).send("Server is running successfully!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`run on ${PORT}`);
});
