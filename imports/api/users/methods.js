import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';

import { Events } from '../events/events.js';

export const register = new ValidatedMethod({
  name: 'users.register',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    password: { type: String },
  }).validator(),
  run({ email, password }) {
    const options = {
      email,
      password,
    };
    const userId = Accounts.createUser(options);

    Meteor.users.update(userId, { $set: { email } });
  },
});

export const update = new ValidatedMethod({
  name: 'users.update',
  validate: new SimpleSchema({
    name: { type: String },
    avatar: { type: String, regEx: SimpleSchema.RegEx.Url },
  }).validator(),
  run({ name, avatar }) {
    if (!this.userId) {
      throw new Meteor.Error('users.joinEvent.accessDenied',
        'You must be logged in to join an event!');
    }

    Meteor.users.update(this.userId, {
      $set: {
        name,
        avatar,
        connections: [],
        blocked: [],
        created: [],
      }
    });
  },
});

export const fullRegister = new ValidatedMethod({
  name: 'users.fullRegister',
  validate: new SimpleSchema({
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
    password: { type: String },
    name: { type: String },
    avatar: { type: String, regEx: SimpleSchema.RegEx.Url },
  }).validator(),
  run({ email, password, name, avatar }) {
    console.log('in reg');
    const options = {
      email,
      password,
    };

    const userId = Accounts.createUser(options);

    Meteor.users.update(userId, {
      $set: {
        email,
        name,
        avatar,
        connections: [],
        blocked: [],
        created: [],
      }
    });

    console.log(Meteor.users.findOne(userId));
  },
});

export const joinEvent = new ValidatedMethod({
  name: 'users.joinEvent',
  validate: new SimpleSchema({
    eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ eventId }) {
    const userEvents = Meteor.user().events || [];
    let userEventIds = [];

    userEvents.forEach((anEvent) => {
      userEventIds.push(anEvent.eventId);
    });

    if (!this.userId) {
      throw new Meteor.Error('users.joinEvent.accessDenied',
        'You must be logged in to join an event!');
    } else if (userEventIds.length > 0 && userEventIds.indexOf(eventId) != -1) {
      throw new Meteor.Error('users.joinEvent.alreadyJoined',
        'You have already joined this event!');
    }

    Meteor.users.update(this.userId, { $push: { events: eventId } });
    Events.update(eventId, { $push: { usersGoing: this.userId } });
  },
});

export const leaveEvent = new ValidatedMethod({
  name: 'users.leaveEvent',
  validate: new SimpleSchema({
    eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),
  run({ eventId }) {
    if (!this.userId) {
      throw new Meteor.Error('users.leaveEvent.accessDenied',
        'You must be logged in to leave an event!');
    }

    Meteor.users.update(this.userId, { $pull: { events: eventId } });
    Events.update(eventId, { $pull: { usersGoing: this.userId } });
  },
});

export const addBackground = new ValidatedMethod({
  name: 'users.addBackground',
  validate: new SimpleSchema({
    background: { type: String, regEx: SimpleSchema.RegEx.Url },
  }).validator(),
  run({ background }) {
    if (!this.userId) {
      throw new Meteor.Error('users.addBackground.accessDenied',
        'You must be logged in to add a background!');
    }

    Meteor.users.update(this.userId, { $set: { background } });
  },
});
