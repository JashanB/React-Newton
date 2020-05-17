
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let id = req.session.user_id;
    if (id) {
      res.redirect(`/${id}`);
    } else {
    res.render("login");
    }
  });

  router.post("/", (req, res) => {
    let email = req.body.email;
    if (email.length === 0) {
      //later change to error on template ejs
      res.status(404).send('Error: No email inputed.');
    } else {
      return db.getUserWithEmail(email)
      .then( user => {
        if (!user) {
          //will add an error
          res.redirect("/signup");
        } else {
          req.session.user_id = user.id;
          res.redirect(`/${user.id}`);
        }
      })

    }
  })


  return router;
};
