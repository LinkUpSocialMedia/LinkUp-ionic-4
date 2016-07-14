import './events-details.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import '../../api/users/methods.js';

import { Events } from '../../api/events/events.js';

// Template.Events_details.onCreated(function() {
//   const id = FlowRouter.getParam('_id');
//   this.autorun(() => {
//     this.subscribe('events.details', id);
//   });
// });

Template.Events_details.helpers({
  events() {
    return [Session.get('eventDetails').event];
  },
  address() {
    const data = Session.get('eventDetails').event;
    const address = data.address.slice(0, -11);
    return address;
  },
  date() {
    const data = Session.get('eventDetails').event;
    const date = data.dateOccuring.toLocaleDateString() + ' at ' + data.dateOccuring.toString().slice(16, -18);
    return date;
  },
});

Template.Events_details.events({
  'click #js-join-event'() {
    const eventId = Session.get('eventDetails').event._id;

    Meteor.call('users.joinEvent', { eventId });

    FlowRouter.go('Events.going');
    Session.set('detailsShow', false);
  }
});
