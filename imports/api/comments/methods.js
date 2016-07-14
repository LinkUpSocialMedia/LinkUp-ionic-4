import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Comments } from './comments.js';

export const insert = new ValidatedMethod({
  name: 'comments.insert',
  validate: new SimpleSchema({
    eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
    message: { type: String },
    name: { type: String },
    avatar: { type: String, regEx: SimpleSchema.RegEx.Url },
  }).validator(),
  run({ eventId, message, name, avatar }) {
    if (!this.userId) {
      throw new Meteor.Error('comments.insert.accessDenied',
        'You must be logged in to add a comment!');
    }

    const comment = {
      userId: this.userId,
      eventId,
      name,
      avatar,
      message,
      dateCreated: new Date(),
      likes: 0,
    };

    Comments.insert(comment);
  },
});

export const like = new ValidatedMethod({
  name: 'comments.like',
  validate: new SimpleSchema({
    commentId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ commentId }) {
    if (!this.userId) {
      throw new Meteor.Error('comments.like.accessDenied',
        'You must be logged in to like a comment!');
    }

    Comments.update(commentId, {
      $inc: { likes: 1 }
    });
  },
});
