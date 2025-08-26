// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bootstrap from "./index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize backend (GraphQL, DB, etc.)
bootstrap();
// Example API route
app.get("/graphql", (_, res) => {
    res.json({ message: "Hello from backend" });
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "ecommerce-app", "dist")));
app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "ecommerce-app", "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
