import './events-going.html';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Events_going.onCreated(function() {
  this.autorun(() => {
    this.subscribe('users.current');
  });
});

Template.Events_going.helpers({
  events() {
    let events = Meteor.users.findOne().events;
    events.sort((a, b) => {
      if (a.dateOccuring.getTime() > b.dateOccuring.getTime()) {
        return 1;
      }
      if (a.dateOccuring.getTime() < b.dateOccuring.getTime()) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    return events;
  },
  details() {
    return Session.get('detailsShow');
  },
});

Template.Events_going.events({
  'click .js-show-details'(event, instance) {
    const userEvents = Meteor.users.findOne().events;
    const eventData = _.find(userEvents, (obj) => {
      return obj.eventId === event.target.id;
    });
    Session.set('eventDetails', { event: eventData });
    Session.set('detailsShow', 'show');
  },
  'click .list-card a'(event, instance) {
    Session.set('detailsShow', false);
  }
});
