const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const mqttRoutes = require("./routes/mqttRoutes");
const truckRoutes = require("./routes/truckRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const companyRoutes = require("./routes/companyRoutes");
dotenv.config({ path: "./.env" });



mongoose
  .connect(process.env.DATABASE)
  .then(() => {
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
app.use(companyRoutes);
const port = 1234;

app.listen(port, () => {
  console.log("The server is running on Port: " + port);
});
