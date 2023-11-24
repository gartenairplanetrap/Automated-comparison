import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import imagesRoutes from "./routes/imagesRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
/* import configureJwtStrategy from "./passport-config.js"; */
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import http from "http";
import { Server } from "socket.io";

import fs from "fs";

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  express.json({
    extended: true,
    limit: "10mb",
  })
);

dotenv.config();
app.use(cookieParser());
app.use(passport.initialize());
/* configureJwtStrategy(passport); */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 3001;

app.use("/api", imagesRoutes);

console.log(
  "Connecting to the database. Put the kettle on while you wait... 🫖"
);

server.listen(port, () =>
  console.log(`The server is listening on port ${port} ... 🐒`)
);

/* console.log(
  "Connecting to the database. Put the kettle on while you wait... 🫖"
);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}.${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Database connected! 😍☕");

    // Serve frontend client/build folder
    app.use(express.static(path.join(__dirname, "../client/build")));
    app.get("*", (req, res) => {
      const indexPath = path.join(__dirname, "../client/build/index.html");
      fs.stat(indexPath, (err, stats) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error serving index.html");
        } else {
          res.sendFile(indexPath);
        }
      });
    });

    app.get("/", (req, res) => {
      res.send("Welcome to my API!");
    });

    app.listen(port, () =>
      console.log(`The server is listening on port ${port} ... 🐒`)
    );
  })
  .catch((error) => {
    console.log(error, "Database did not connect! ☹️❌");
  });
 */
export { io };
