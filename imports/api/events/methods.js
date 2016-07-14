import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Faker } from 'meteor/practicalmeteor:faker';
import { GeoCodes } from 'meteor/aldeed:geocoder';

import { Events } from './events.js';
import '../users/methods.js';

export const insert = new ValidatedMethod({
  name: 'events.insert',
  validate: new SimpleSchema({
    name: { type: String },
    description: { type: String },
    address: { type: String },
    dateOccuring: { type: Date },
    avatar: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
    category: { type: String },
  }).validator(),
  run({ name, description, address, dateOccuring, avatar, category }) {
    if (!this.userId) {
      throw new Meteor.Error('events.insert.accessDenied',
        'You must be logged in to insert an event!');
    } else if (Events.findOne({ name })) {
      throw new Meteor.Error('events.insert.duplicateName',
        'The event name already exists.');
    } else if (Events.find({ createdBy: this.userId }).fetch().length > 5) {
      throw new Meteor.Error('events.insert.tooManyEvents',
        'You can only have 5 active events at once!');
    }

    const geo = new GeoCoder();
    const latlng = geo.geocode(address);
    const lat = latlng[0].latitude;
    const lng = latlng[0].longitude;
    const formalAddress = geo.reverse(lat, lng);

    const location = {
      type: 'Point',
      coordinates: [lng, lat],
    };

    const user = Meteor.user();

    // createdBy and userAvatar defaults are for TESTING ONLY
    const event = {
      name,
      description,
      location,
      address: formalAddress[0].formattedAddress,
      avatar: avatar || '',
      dateOccuring,
      unixTime: dateOccuring.getTime(),
      userId: this.userId,
      createdBy: user.name,
      userAvatar: user.avatar,
      dateCreated: new Date(),
      usersGoing: 0,
      category,
    };

    let eventId = Events.insert(event);

    Meteor.call('users.joinEvent', { eventId });
  },
});

export const remove = new ValidatedMethod({
  name: 'events.remove',
  validate: new SimpleSchema({
    eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ eventId }) {
    const event = Events.findOne(eventId);

    if (!this.userId) {
      throw new Meteor.Error('events.remove.accessDenied',
        'You must be logged in to remove an event!');
    } else if (this.userId !== event.createdBy) {
      throw new Meteor.Error('events.remove.accessDenied',
        'You must own the event to remove it!');
    }

    Meteor.users.update({}, {
      $pull: {
        events: { eventId }
      }
    });

    Events.remove(eventId);
  },
});
