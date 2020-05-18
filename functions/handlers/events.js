const { db } = require("../util/admin");

exports.getEvents = (req, res) => {
  db.collection("events")
    .where("day", "==", req.params.day)
    .get()
    .then((data) => {
      let events = [];
      data.forEach((doc) => {
        events.push({
          eventId: doc.id,
          dayId: doc.data().dayId,
          title: doc.data().title,
          time: doc.data().time,
        });
      });
      return res.json(events);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getEvent = (req, res) => {
  let eventData = {};
  db.doc(`/events/${req.params.eventId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "Event not found",
        });
      }
      eventData = doc.data();
      eventData.eventId = doc.id;
      return db
        .collection("panels")
        .where("eventId", "==", req.params.eventId)
        .get();
    })
    .then((data) => {
      eventData.panels = [];
      console.log(data);
      data.forEach((doc) => {
        eventData.panels.push(doc.data());
      });
      return res.json(eventData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getPanelData = (req, res) => {
  let panelData = {};
  db.collection("panelists")
    .orderBy("order")
    .where("panelId", "==", req.params.panelId)
    .get()
    .then((data) => {
      panelData.panelists = [];
      data.forEach((doc) => {
        panelData.panelists.push(doc.data());
      });
      return res.json(panelData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.likeEvent = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("panelId", "==", req.params.panelId)
    .limit(1);

  likeDocument
    .get()
    .then((data) => {
      if (data.empty) {
        let newLikeDocument = {
          panelId: req.params.panelId,
          userHandle: req.user.handle,
        };
        return db
          .collection("likes")
          .add(newLikeDocument)
          .then(() => {
            return res.json(newLikeDocument);
          });
      } else {
        return res.status(400).json({ error: "Post already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//Need to remove like document from database and also Redux store
exports.unlikeEvent = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("panelId", "==", req.params.panelId)
    .limit(1);

  likeDocument
    .get()
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Event not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            return res.json("Panel successfully unliked");
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getLikes = (req, res) => {
  let likesData = {};
  db.collection("likes")
    .where("userHandle", "==", req.user.handle)
    .get()
    .then((data) => {
      likesData.likes = [];
      data.forEach((doc) => {
        likesData.likes.push(doc.data());
      });
      return res.json(likesData);
    });
};
