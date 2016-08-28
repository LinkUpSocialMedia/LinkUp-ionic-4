import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Meteor } from 'meteor/meteor';

export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  Events._ensureIndex({'location': '2dsphere'});
}

Events.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Events.schema = new SimpleSchema({
  name: { type: String },
  eventDescription: { type: String },
  location: { type: Object },
  "location.type": { type: String },
  "location.coordinates": { type: [Number], decimal: true },
  address: { type: String },
  avatar: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
  dateOccuring: { type: Date },
  unixTime: { type: Number },
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  createdBy: { type: String },
  userAvatar: { type: String, regEx: SimpleSchema.RegEx.Url },
  dateCreated: { type: Date },
  usersGoing: { type: [String], min: 0, regEx: SimpleSchema.RegEx.Id },
  // category: { type: String, },
});

Events.attachSchema(Events.schema);

Events.publicFields = {
  name: 1,
  eventDescription: 1,
  location: 1,
  address: 1,
  avatar: 1,
  createdBy: 1,
  userAvatar: 1,
  dateOccuring: 1,
  usersGoing: 1,
  unixTime: 1,
  // category: 1,
};
