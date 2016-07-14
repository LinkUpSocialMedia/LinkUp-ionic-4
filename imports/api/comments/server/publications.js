import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Comments } from '../comments.js';

Meteor.publish('comments.ofEvent', function commentsOfEvent(eventId) {
  new SimpleSchema({
    eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validate({ eventId });

  if (!this.userId) {
    return this.ready();
  }

  return Comments.find({ eventId }, {
    sort: { dateCreated: 1 }
  }, {
    fields: Comments.publicFields,
  });
});
