
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  //sign up page
  router.get("/", (req, res) => {
    let id = req.session.user_id;
    if (id) {
      return db.getUserWithId(id)
      .then ( user => {
        let templateVars = { user }
        res.redirect(`/${id}`)
      });
    } else {
      return db.getAllTopics()
      .then(topics => {
        let templateVars = { topics }
        res.render("signup", templateVars);
      })
    }
  });

//sign up user
  router.post("/", (req, res) => {
    const email = req.body.email;
    const topic1 = req.body.topics1;
    const topic2 = req.body.topics2;
    const topic3 = req.body.topics3;
    if (email.length === 0) {
      //later change to error on template ejs
      res.status(404).send('Error: No email inputed.');
    } else {
      //checks if email is already in use
      return db.getUserWithEmail(email)
      .then( user => {
        if (!user) {
          //if email is not in use, adds user to database
          return db.addUser(email)
          .then(data => {
            req.session.user_id = data.id;
            const user = data;
            return user;
          }).then( user => {
            console.log('in post')
            const userId = user.id;
            db.addTopicsToUser(userId, topic1, topic2, topic3).then( () => {
              res.json({error: null, user_id: userId});
            });
          }).catch(err => {
            console.log(err);
          })
        } else {
          //email in use, sends error -> later change to error on template ejs
          res.json({error: 'Sorry, that email appears to already be in use'});
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  })

  return router;
};

