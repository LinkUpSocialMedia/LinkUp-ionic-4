import './app-body.html';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

Template.App_body.onCreated(function() {
  Session.set('started', true);
  this.autorun(() => {
    if (!Meteor.userId()) {
      FlowRouter.go('Auth.startup');
    }
  });
});

Template.App_body.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#e9e5dc');
  }
});

Template.App_body.helpers({
  eventsPage() {
    const route = FlowRouter.getRouteName();

    if (route === 'Events.map' || route === 'Events.list') {
      if (Meteor.isCordova) {
        StatusBar.backgroundColorByHexString('#e9e5dc');
      }
      return true;
    }
  },
  linksPage() {
    if (FlowRouter.getRouteName() === 'Users.links') {
      if (Meteor.isCordova) {
        StatusBar.backgroundColorByHexString('#3b9845');
      }
      return true;
    }
  },
  chatPage() {
    if (FlowRouter.getRouteName() === 'Users.chat') {
      return true;
    }
  },
  profilePage() {
    if (FlowRouter.getRouteName() === 'Users.profile') {
      return true;
    }
  },
});

Template.App_body.events({
  'click .ion-navicon-round'() {
    Meteor.logout();
  }
});
