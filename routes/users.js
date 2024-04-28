const express = require("express");
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Decsription: Get all users
 * Access: Public
 * Paramaters: None
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * Route: /users/:id
 * Method: GET
 * Decsription: Get user by their ID
 * Access: Public
 * Paramaters: ID
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User Does Not Exist",
    });
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Route: /users
 * Method: POST
 * Decsription: Create/Add a new user
 * Access: Public
 * Paramaters: None
 */
router.post("/", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;

  const user = users.find((each) => each.id === id);

  if (user) {
    return res.status(404).json({
      success: false,
      message: "User With the Id already exists",
    });
  }
  users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
  });
  return res.status(201).json({
    success: true,
    data: users,
  });
});

/**
 * Route: /users/:id
 * Method: PUT
 * Decsription: Updating a user by their id
 * Access: Public
 * Paramaters: ID
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const user = users.find((each) => each.id === id);

  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "User Does Not Exist" });

  const updatedUser = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });
  return res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

/**
 * Route: /users/:id
 * Method: DELETE
 * Decsription: Delete a user by ID
 * Access: Public
 * Paramaters: ID
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);

  if (!user)
    return res.status(404).json({ success: false, message: "User Not Found" });

  const index = users.indexOf(user);
  users.splice(index, 1);

  return res.status(200).json({ success: true, data: users });
});

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Decsription: Get all user subscription details by their ID
 * Access: Public
 * Paramaters: ID
 */

router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((each) => each.id === id);
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User With The Given Id Doesn't Exist",
    });

  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      // current Date
      date = new Date();
    } else {
      // getting date on a basis of data variable
      date = new Date(data);
    }
    let days = Math.floor(data / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else if (user.subscriptionType === "Premium") {
      date = date + 365;
    }
    return date;
  };

  // Subscription expiration calcus
  // Jan 1, 1970, UTC // milliseconds
  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  const data = {
    ...user,
    subscriptionExpired: subscriptionExpiration < currentDate,
    daysLeftForExpiration:
      subscriptionExpiration <= currentDate
        ? 0
        : subscriptionDate - currentDate,
    fine:
      returnDate < currentDate
        ? subscriptionExpiration <= currentDate
          ? 200
          : 100
        : 0,
  };

  res.status(200).json({
    success: true,
    data: data,
  });
});

// default export
module.exports = router;
