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
    .where("eventId", "==", req.params.eventId)
    .limit(1);

  likeDocument.get().then((data) => {
    if (data.empty) {
      return db
        .collection("likes")
        .add({ eventId: req.params.eventId, userHandle: req.user.handle });
    }
  });
};

exports.unlikeEvent = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("eventId", "==", req.params.eventId)
    .limit(1);
};
