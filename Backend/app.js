require("dotenv").config();
require("./DataBase/connection");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;

const authenticationRoute = require("./routes/authenticationRoute");
const workspaceRoute = require("./routes/workspaceRoute");
const taskRoute = require("./routes/taskRoute");
const teamLeadRoute = require("./routes/teamleadRoute");
const TimerRoute = require('./routes/TimerRoute')
const { authentication } = require("./middleware/auth");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());
app.use("/", authenticationRoute);
app.use("/workspaces", authentication, workspaceRoute); 
app.use("/workspaces", authentication, taskRoute); 
app.use("/workspaces", authentication, teamLeadRoute);
app.use("/timer", authentication, TimerRoute)

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
