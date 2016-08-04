import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Messages } from '../messages.js';

Meteor.publish('messages.ofUser', function messagesOfUser() {
  if (!this.userId) {
    return this.ready();
  }

  return Messages.find({
    $or: [{ senderId: this.userId }, { receiverId: this.userId }]
  }, {
    sort: { time: 1 }, fields: Messages.publicFields
  });
});

Meteor.publish('messages.withUser', function messagesWithUser(userId) {
  new SimpleSchema({
    userId: { type: String },
  }).validate({ userId });

  if (!this.userId) {
    return this.ready();
  }

  return Messages.find({
    $or: [{
      $and: [ { senderId: userId }, { receiverId: this.userId } ]
    }, {
      $and: [ { senderId: this.userId }, { receiverId: userId } ]
    }]
  }, {
    sort: { time: 1 }, fields: Messages.publicFields
  });
});
