import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Events } from '../../events/events.js';

Meteor.publish('users.inEvent', function usersInEvent(eventId) {
  new SimpleSchema({
    eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validate({ eventId });

  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({
    events: {
      $in: [eventId]
    }
  }, {
    fields: {
      name: 1,
      email: 1,
      avatar: 1,
      connections: 1,
    }
  });
});

Meteor.publish('users.current', function usersCurrent() {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({ _id: this.userId }, {
    fields: {
      name: 1,
      email: 1,
      events: 1,
      avatar: 1,
      connections: 1,
      blocked: 1,
    }
  });
});
