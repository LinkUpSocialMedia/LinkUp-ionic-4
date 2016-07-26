import './events-details.html';

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Events_details.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    user: {},
  });

  this.autorun(() => {
    this.subscribe('users.current');
  });
  this.autorun(() => {
    this.state.set('user', Meteor.users.findOne());
  });
});

Template.Events_details.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#fff');
  }
});

Template.Events_details.helpers({
  events() {
    return [Session.get('eventDetails')];
  },
  totalComments() {
    return 0;
  },
  eventDate(date) {
    const options = {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  },
  lastRoute() {
    return Session.get('lastRoute');
  },
  inEvent() {
    const user = Meteor.users.findOne();
    console.log(user.events.indexOf(Session.get('eventDetails')._id));
    if (user.events.indexOf(Session.get('eventDetails')._id) != -1) {
      return true;
    }
  },
  ownEvent() {
    const user = Meteor.users.findOne();
    console.log(user.created);
    if (user.created.indexOf(Session.get('eventDetails')._id) != -1) {
      return true;
    }
  }
});

Template.Events_details.events({
  'click .js-join-event'() {
    // joinEvent.call({
    //   eventId: Session.get('eventDetails')._id,
    // });
    Meteor.call('users.joinEvent', { eventId: Session.get('eventDetails')._id });
    FlowRouter.go('Users.links');
  },
  'click .js-leave-event'() {
    // joinEvent.call({
    //   eventId: Session.get('eventDetails')._id,
    // });
    Meteor.call('users.leaveEvent', { eventId: Session.get('eventDetails')._id });
    FlowRouter.go(Session.get('lastRoute'));
  },
  'click .js-cancel-event'() {
    // joinEvent.call({
    //   eventId: Session.get('eventDetails')._id,
    // });
    Meteor.call('events.remove', { eventId: Session.get('eventDetails')._id });
    FlowRouter.go(Session.get('lastRoute'));
  },
});
