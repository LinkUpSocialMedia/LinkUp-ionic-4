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
});
