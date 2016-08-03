import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Messages } from '../messages.js';

Meteor.publish('messages.ofUser', function messagesOfUser() {
  if (!this.userId) {
    return this.ready();
  }

  return Messages.find({
    $or: [{ senderId: this.userId }, { receiverId: this.userId }]
  });
});

Meteor.publish('messages.withUser', function messagesWithUser() {
  if (!this.userId) {
    return this.ready();
  }

  return Messages.find({

  });
});
