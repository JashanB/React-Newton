const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const id = req.session.user_id;
    if (id) {
      res.redirect(`/myResources/${id}`)
    } else {
      res.redirect('/');
    }
  })
  router.get("/:user_id", (req, res) => {
    const id = req.session.user_id;
    if (id) {
      let userId = parseInt(req.session.user_id);
      if (id === userId) {
        db.getAllMyLikedResources(id)
          .then(data => {
            const liked = data;
            db.getAllMyUploadedResources(id)
            .then(data => {
              const uploaded = data;
              const resource = { liked: liked, uploaded: uploaded, userId: userId };
            res.render('myResources', { resource });
            })
            .catch(err => {
              console.error(err);
            });
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        res.redirect("/")
      }
    } else {
      res.redirect("/")
    }
  });

  router.post("/search/:user_id", (req, res) => {
    const search = req.body.search.slice(1);
    let userId = parseInt(req.session.user_id);
    if (userId) {
      db.getAllMyLikedResourcesBySearch(search, userId)
      .then(data => {
        const liked = data;
        db.getAllMyUploadedResources(userId)
        .then(data => {
          const uploaded = data;
          const resource = { liked: liked, uploaded: uploaded, userId: userId };
        res.render('myResources', { resource });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err.stack)
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err.stack)
      });
    } else {
      res.redirect('/');
    }
  });

  router.delete('/delete/:resourceid', (req, res) => {
    const userId = parseInt(req.session.user_id);
    const resourceId = req.params.resourceid;
    if (userId) {
    db.deleteUploadedResource(resourceId, userId)
    .then( () => {
      res.redirect(`/myResources/${userId}`);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err.stack)
    })
  } else {
    res.redirect(`/myResources/${userId}`);
  }
  });

  router.delete('/unlike/:resourceid', (req, res) => {
    console.log('ROTED')
    const userId = parseInt(req.session.user_id);
    const resourceId = req.params.resourceid;
    if (userId) {
      db.deleteLiked(resourceId, userId)
      .then( () => {
        res.redirect(`/myResources/${userId}`);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err.stack)
      })
    } else {
      res.redirect('/');
    }
  });

  return router;
};
