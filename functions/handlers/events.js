const { db } = require("../util/admin");

exports.getAllEvents = (req, res) => {
  db.collection("events")
    // .orderBy("section", "asc")
    .get()
    .then(data => {
      let events = [];
      data.forEach(doc => {
        events.push({
          eventId: doc.id,
          dayId: doc.data().dayId,
          title: doc.data().title,
          time: doc.data().time
        });
      });
      return res.json(events);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};

exports.getEvent = (req, res) => {
  let eventData = {};
  db.doc(`/events/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "Event not found"
        });
      }
      eventData = doc.data();
      eventData.eventId = doc.id;
      return db
        .collection("panels")
        .where("eventId", "==", req.params.eventId)
        .get();
    })
    .then(data => {
      eventData.panels = [];
      data.forEach(doc => {
        eventData.panels.push(doc.data());
      });
      return res.json(eventData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// exports.getPanel = (req, res) => {
//   let panelData = {};
//   db.doc(`/panel/${req.params.panelId}`)
//     .get()
//     .then(doc => {
//       if (!doc.exists) {
//         return res.status(404).json({
//           error: "Event not found"
//         });
//       }
//       eventData = doc.data();
//       eventData.eventId = doc.id;
//       return db
//         .collection("panels")
//         .where("eventId", "==", req.params.eventId)
//         .get();
//     })
//     .then(data => {
//       eventData.panels = [];
//       data.forEach(doc => {
//         eventData.panels.push(doc.data());
//       });
//       return res.json(eventData);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: err.code });
//     });
// };
