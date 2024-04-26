const express = require("express");
const { users } = require("./data/users.json");

const app = express();

const PORT = 8081;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running sucessfully",
    data: "hey",
  });
});

/**
 * Route : /users
 * Method : GET
 * Description : get all user information
 * Access : public
 * Parameters : None
 */

app.get("/users", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

app.get("*", (req, res) => {
  res.status(200).json({
    message: "this route doesn't exist",
  });
});

app.listen(PORT, () => {
  console.log(`Server is up and running at PORT ${PORT}`);
});