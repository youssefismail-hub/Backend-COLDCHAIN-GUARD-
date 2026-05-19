const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const mqttRoutes = require("./routes/mqttRoutes");
const truckRoutes = require("./routes/truckRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const companyRoutes = require("./routes/companyRoutes");
const alertRoutes = require("./routes/alertRoutes");
const http = require("http");

dotenv.config({ path: "./.env" });



mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    require("./mqtt/mqttSubscriber");
    console.log("Connection to the DB secured !!!");
  })
  .catch((e) => {
    console.log("Error: " + e);
  });

const app = express();
app.use(express.json());
app.use(userRoutes);
app.use(mqttRoutes);
app.use(truckRoutes);
app.use(telemetryRoutes);
app.use(alertRoutes);
app.use(companyRoutes);
const port = 1234;
//  Create HTTP Server
const server = http.createServer(app);

//  Initialize Socket.io
const socket = require("./socket");
socket.init(server);

app.listen(port, () => {
  console.log("The server is running on Port: " + port);
});
