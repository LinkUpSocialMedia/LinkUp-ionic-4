import './events-list.html';
import '../components/events-view-button.js';
import '../components/event-card.js';

import { Template } from 'meteor/templating';
import { Events } from '../../api/events/events.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

Template.Events_list.onCreated(function() {
  this.autorun(() => {
    this.subscribe('events.nearby', 44.477553, -73.199853);
  });

  // this.state = new ReactiveDict();
  // this.state.setDefault({
  //   detailsShow: false,
  // });
});

Template.Events_list.helpers({
  events() {
    return Events.find({}, {
      sort: { dateOccuring: 1 }
    });
  },
  details() {
    return Session.get('detailsShow');
  },
});
