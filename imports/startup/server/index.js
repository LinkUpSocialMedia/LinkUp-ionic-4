import './register-api.js';
import './fixtures.js';
import { Meteor } from 'meteor/meteor';

// if (Meteor.userId()) {
//   const userEvents = Meteor.user().events;
//   const date = new Date();
//   date.setDate(date.getDate() + 1); // tomorrow's date
//
//   userEvents.forEach((event) => {
//     if (event.dateOccuring < date) {
//       Meteor.call('users.clearEvent', event.eventId);
//     }
//   });
// }

Meteor.startup(() => {
  if (Meteor.isServer) {
    if (this.userId) {
      const userEvents = Meteor.user().events;
      const date = new Date();
      date.setDate(date.getDate() + 1); // tomorrow's date

      userEvents.forEach((event) => {
        if (event.dateOccuring < date) {
          Meteor.users.update(Meteor.userId(), { $pull: { events: event._id }})
        }
      });
    }
  }
});
