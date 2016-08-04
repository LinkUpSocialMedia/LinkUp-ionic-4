import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Random } from 'meteor/random';

import { Messages } from './messages.js';

export const send = new ValidatedMethod({
  name: 'messages.send',
  validate: new SimpleSchema({
    message: { type: String },
    receiverId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ message, receiverId }) {
    if (!this.userId) {
      throw new Meteor.Error('messages.send.accessDenied',
        'You must be logged in to send a message!');
    }

    const sender = Meteor.user();
    const receiver = Meteor.users.findOne(receiverId);

    const chat = {
      senderName: sender.name,
      senderId: sender._id,
      senderAvatar: sender.avatar,
      message,
      time: new Date(),
      receiverName: receiver.name,
      receiverId,
      receiverAvatar: receiver.avatar,
    };

    const messageGroup = Messages.find({
      $or: [{
        $and: [{ senderId: this.userId }, { receiverId: receiverId }]
      }, {
        $and: [{ senderId: receiverId }, { receiverId: this.userId }]
      }]
    }, {
      fields: { messageGroupId: 1 },
      limit: 1
    }).fetch() || [];

    if (messageGroup.length > 0) {
      chat.messageGroupId = messageGroup[0].messageGroupId;
    } else {
      chat.messageGroupId = Random.id();
    }

    Messages.insert(chat);
  },
});
