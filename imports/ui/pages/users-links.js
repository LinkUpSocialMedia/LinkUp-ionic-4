import './users-links.html';
import '../components/link-card.js';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Events } from '../../api/events/events.js';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.Users_links.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    currentEvent: '',
    showList: '',
  });

  this.subscribe('users.current');
  this.subscribe('users.inEvent', this.state.currentEvent);
  this.subscribe('events.usersGoing');
});

Template.Users_links.helpers({
  linksExist() {
    const user = Meteor.users.findOne();

    if (user.events.length > 0) {
      return true;
    }
  },
  links() {
    const user = Meteor.users.findOne();

    return user.events;
  },
  eventUsers() {
    const users = Meteor.users.find().fetch();

    function removeSelf(user) {
      if (user._id === Meteor.userId()) {
        return false;
      }
      return true;
    }

    let usersNotSelf = users.filter(removeSelf);

    console.log(usersNotSelf);

    return usersNotSelf;
  },
  usersGoingHelper() {
    return Meteor.users.find().fetch().length;
  },
  showList() {
    return Template.instance().state.get('showList');
  },
});

Template.Users_links.events({
  'click .link-card'(event, instance) {
    instance.state.set('currentEvent', this.link.eventId);
    instance.state.set('showList', 'show');
  },
});
