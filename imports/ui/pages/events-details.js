import './events-details.html';

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';

import { joinEvent } from '../../api/users/methods.js';

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
});

Template.Events_details.events({
  'click .js-join-event'() {
    // joinEvent.call({
    //   eventId: Session.get('eventDetails')._id,
    // });
    Meteor.call('users.joinEvent', { eventId: Session.get('eventDetails')._id });
    FlowRouter.go('Users.links');
  },
});
