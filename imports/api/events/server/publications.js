import { Meteor } from 'meteor/meteor';
import { Events } from '../events.js';

Meteor.publish('events.nearby', function eventsNearby(lat, lng) {
  new SimpleSchema({
    lat: { type: Number, decimal: true },
    lng: { type: Number, decimal: true },
  }).validate({ lat, lng });

  if (!this.userId) {
    return this.ready();
  }

  const twoMiles = 3218.69;
  const currentTime = new Date();
  const currentUnixTime = currentTime.getTime();

  return Events.find({
    $and: [{
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: twoMiles
        }
      }
    }, {
      unixTime: {
        $gt: currentUnixTime
      }
    }]
  });

    // return Events.find({
    //   location: {
    //     $nearSphere: {
    //       $geometry: {
    //         type: "Point",
    //         coordinates: [lng, lat],
    //       },
    //       $maxDistance: twoMiles
    //     }
    //   }
    // }, {
    //   sort: { dateOccuring: 1 }
    // }, {
    //   fields: Events.publicFields,
    // });
});

// Meteor.publish('events.details', function eventsDetails(eventId) {
//   new SimpleSchema({
//     eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
//   }).validate({ eventId });
//
//   if (!this.userId) {
//     return this.ready();
//   }
//
//   return Events.find(eventId);
// });
