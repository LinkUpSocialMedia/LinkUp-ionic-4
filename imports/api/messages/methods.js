import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Messages } from './messages.js';

export const send = new ValidatedMethod({
  name: 'messages.send',
  validate: new SimpleSchema({
    message: { type: String },
    receiverIds: { type: [String], min: 1, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ message, receiverIds }) {
    if (!this.userId) {
      throw new Meteor.Error('messages.send.accessDenied',
        'You must be logged in to send a message!');
    }

    const user = Meteor.user();

    const message = {
      senderName: user.name,
      senderId: user._id,
      senderAvatar: user.avatar,
      message,
      time: new Date(),
      receiverIds,
    };

    Messages.insert(message);
  },
});
