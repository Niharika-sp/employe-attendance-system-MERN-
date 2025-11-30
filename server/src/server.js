import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import connect from "./utils/db.js";

let port = parseInt(process.env.PORT || "5050", 10);

const startHttp = () => {
  const server = http.createServer(app);
  server
    .listen(port, () => {
      console.log(`api:${port}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        port += 1;
        startHttp();
      } else {
        process.exit(1);
      }
    });
};

const start = async () => {
  await connect(process.env.MONGODB_URI);
  startHttp();
};

start();
