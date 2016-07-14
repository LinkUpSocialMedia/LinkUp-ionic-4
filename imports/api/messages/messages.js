import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Messages = new Mongo.Collection('messages');

Messages.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Messages.schema = new SimpleSchema({
  senderName: { type: String },
  senderId: { type: String, regEx: SimpleSchema.RegEx.Id },
  senderAvatar: { type: String, regEx: SimpleSchema.RegEx.Url },
  message: { type: String },
  time: { type: Date },
  receiverIds: { type: [String], min: 1, regEx: SimpleSchema.RegEx.Id },
});

Messages.attachSchema(Messages.schema);

Messages.publicFields = {
  senderName: 1,
  senderId: 1,
  senderAvatar: 1,
  message: 1,
  time: 1,
  receiverIds: 1,
};
