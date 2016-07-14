import './app-body.html';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

import '../components/loading.js';

Template.App_body.onCreated(function() {
  this.autorun(() => {
    this.subscribe('users.current', Meteor.userId());
  });

  this.autorun(() => {
    if (!Meteor.userId()) {
      FlowRouter.go('login');
    }
  });
});

Template.App_body.helpers({
  authPage() {
    let route = FlowRouter.getRouteName();

    if (route === 'forgot' || route === 'login' || route === 'join' || route === 'create') {
      return route;
    }
    return false;
  },
  chatPage() {
    let route = FlowRouter.getRouteName();

    if (route === 'EventChats.chat' || route === 'EventChats.users') {
      return true;
    }
    return false;
  },
  inEvents() {
    if(Meteor.users.findOne().events.length > 0) {
      return true;
    }
  },
  templateGestures: {
    'swiperight .events-details': function(event, instance) {
      Session.set('detailsShow', false);
    },
    'swipeleft .event-chats': function(event, instance) {
      Session.set('showMessageTime', 'show');
    },
    'swiperight .event-chats': function(event, instance) {
      Session.set('showMessageTime', '');
    },
  },
});

Template.App_body.events({
  'click .js-logout'() {
    Meteor.logout();
  },
  'click .title'() {
    Session.set('detailsShow', false);
  },
  'click #user-events'() {
    Session.set('detailsShow', false);
  }
});
