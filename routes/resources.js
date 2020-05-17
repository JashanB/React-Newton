const express = require('express');
const router = express.Router();


module.exports = (db) => {

  router.get("/:id", (req, res) => {
    console.log('reached')
    db.getResourceByID(req.params.id)
      .then(data => {
        const resourceInfo = data;
        return db.getCommentsByID(req.params.id)
          .then(comments => {
            return {
              resourceInfo: resourceInfo,
              comments: comments.rows
            }
          })
      })
      .then(data => {
        return db.getRatingByID(req.params.id)
          .then(ratings => {
            return {
              resourceInfo: data.resourceInfo,
              comments: data.comments,
              ratings: ratings.rows
            }
          })
          .then(data => {
            return db.getLikesByID(req.params.id)
              .then(likes => {
                return {
                  resourceInfo: data.resourceInfo,
                  comments: data.comments,
                  ratings: data.ratings,
                  likes: likes.rows
                }
              })
          })
          .then(data => {
            const userId = req.session.user_id
            const resource = { data, userId };
            res.render('../views/resources',{  resource })
          })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.put('/like/:resourceid', (req, res) => {
    const userId = parseInt(req.session.user_id);
    const resourceId = req.params.resourceid;
    if (userId) {
    db.checkIfLiked(resourceId, userId)
    .then(data => {
      if (data.length !== 0) {
        db.deleteLiked(resourceId, userId)
        .then(() => {
          res.redirect(`/resources/${resourceId}`);
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err.stack)
        });
      } else {
        db.insertIntoLikes(userId, resourceId)
        .then(() => {
          db.getTopicsForResource(resourceId)
          .then(data => {
            const topics = data;
            for (let i = 0; i < topics.length; i++) {
              db.insertUserTopics(userId, topics[i].topic_id)
            }
            res.redirect(`/resources/${resourceId}`);
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
      }
    })
  } else {
    res.redirect(`/resources/${resourceId}`)
  }
  });


  router.put('/rating/:resourceid', (req, res) => {
    //want resource that user liekd to be inserted into likes table with user id and resource id
    const userId = parseInt(req.session.user_id);
    const resourceId = req.params.resourceid;
    //if already liked, then delete, else add
    if (userId) {
    db.checkIfRated(resourceId, userId)
    .then(data => {
      if (data.length !== 0) {
        db.deleteRated(resourceId, userId)
        .then(data => {
          res.redirect(`/resources/${resourceId}`);
        })
      } else {
        db.insertIntoRatings(userId, resourceId)
        .then(data => {
          res.redirect(`/resources/${resourceId}`);
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err.stack)
        });
      }
    })
  } else {
    res.redirect(`/resources/${resourceId}`);
  }
  });

  router.put("/comment/:id", (req, res) => {
    const userId = parseInt(req.session.user_id);
    const text = req.body.comment
    const resourceId = req.params.id
    if (userId) {
    db.postComment(resourceId, userId, text)
    .then( () => {
      res.redirect(`/resources/${resourceId}`)
    }
    )
  } else {
    res.redirect(`/login`)
  }
  });

  return router;
};

