
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:user_id", (req, res) => {
    let id = req.session.user_id;
    console.log(id);
    if (id) {
      let userId = parseInt(req.params.user_id);
      if (id === userId) {
        return db.getTopicsByUserId(id)
        .then(topics => {
          const resource = { topics, userId };
          res.render("profile", {resource});
        })
      } else {
        res.redirect(`/${id}`)
      }

    } else {
      res.redirect("/login");
    }

  });

  //need to add the update stuff

  router.post("/email", (req, res) => {
    let id = req.session.user_id;
    let newEmail = req.body.email;
    console.log(req.body);
    console.log(newEmail);
    if (newEmail.length === 0) {
      res.json({error: 'Please input a valid email'});
    } else {
      return db.getUserWithEmail(newEmail)
      .then(user => {
      if (user) {
        res.json({error: 'Sorry, that email appears to already be in use'});
      } else {
        return db.updateUserEmail(id, newEmail)
        .then( data => {
          if (data) {
            res.json({error: null, email: newEmail});
          }
        })
      }
     })
    }
  });

  router.post("/:topicid", (req, res) => {
    let topicId = req.params.topicid;
    let userId = req.session.user_id;
    return db.deleteTopicFromUser(userId, topicId)
    .then(data => {
      res.redirect(`/profile/${userId}`)
    })
  });
  return router;
};
