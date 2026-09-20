import express from "express";
import userRoutes from "./routes/usersRoute.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardsRoute.js";
import nodeRoutes from "./routes/nodesRoute.js";
import nodeTypesRoutes from "./routes/nodesTypesRoute.js";
import connectionsRoutes from "./routes/connectionsRoute.js";
import connectDB from "./db/connect.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import morgan from "morgan";

const app = express();

app.use(cors({ credentials: true, origin: "https://nodemap-vert.vercel.app" }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/boards/:boardId/nodes", nodeRoutes);
app.use("/api/v1/boards/:boardId/nodesTypes", nodeTypesRoutes);
app.use("/api/v1/boards/:boardId/connections", connectionsRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to NodeMap")
})

app.use(errorHandler)


const port = process.env.PORT || 3000;

await connectDB(process.env.MONGO_URI).catch((err) => {
    console.log("Database connection failed", err);
});

if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(port, () => {
        console.log(`Server is listening on port: ${port}...`);
    })

    server.on("error", (error) => {
        console.log(error);
    })
}


export default app;