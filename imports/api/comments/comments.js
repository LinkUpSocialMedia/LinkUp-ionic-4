import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Comments = new Mongo.Collection('comments');

Comments.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Comments.schema = new SimpleSchema({
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
  name: { type: String },
  avatar: { type: String, regEx: SimpleSchema.RegEx.Url },
  message: { type: String },
  dateCreated: { type: Date },
  likes: { type: Number, min: 0 },
});

Comments.attachSchema(Comments.schema);

Comments.publicFields = {
  eventId: 1,
  name: 1,
  message: 1,
  dateCreated: 1,
  avatar: 1,
  userId: 1,
  likes: 1,
};
