const express = require("express");
const router = express.Router();

const myDB = require("../db/myDB.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/users");
});

router.get("/users", async (req, res) => {
  const page = req.query.page || 1;
  console.log("/users", page);

  try {
    const users = await myDB.getUsers(page);

    // Save the session messages for display, then delete them
    const err = req.session.err;
    const msg = req.session.msg;
    req.session.err = "";
    req.session.msg = "";

    res.render("users", {
      users: users,
      err: err,
      msg: msg,
    });
  } catch (err) {
    console.log("got error", err);
    res.render("users", { err: err.message, users: [] });
  }
});

router.post("/users/delete", async (req, res) => {
  try {
    const user = req.body;
    console.log("trying to del user");
    const result = await myDB.deleteUser(user);
    console.log("deleted user ideally");
    console.log("this is result", result);
    if (result !== 1) {
      req.session.err = `Couldn't delete the object ${user.name}`;
      res.redirect("/users");
      return;
    }

    req.session.msg = "user deleted";
    res.redirect("/users");
    return;
  } catch (err) {
    console.log("got error delete");
    req.session.err = err.message;
    res.redirect("/users");
    return;
  }
});

router.post("/users/update", async (req, res) => {
  try {
    const user = req.body;
    const result = await myDB.updateUser(user);
    console.log("update", result);

    if (result === "OK") {
      req.session.msg = "user Updated";
      res.redirect("/users");
    } else {
      req.session.err = "Error updating";
      res.redirect("/users");
    }
    return;
  } catch (err) {
    console.log("got error update", err);
    req.session.err = err.message;
    res.redirect("/users");
  }
});

router.post("/users/create", async (req, res) => {
  const user = req.body;

  try {
    console.log("Create user", user);
    const result = await myDB.createUser(user, res);
    if (result === 1) {
      req.session.msg = "user created";
      res.redirect("/users");
    } else {
      req.session.err = "There was an error creating the user";
      res.redirect("/users");
    }
    return;
  } catch (err) {
    console.log("Got error create", err);
    req.session.err = err.message;
    res.redirect("/users");
  }
});

module.exports = router;
