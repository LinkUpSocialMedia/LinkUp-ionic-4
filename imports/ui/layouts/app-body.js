import './app-body.html';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';

Template.App_body.onCreated(function() {
  Session.set('started', true);
  this.autorun(() => {
    if (!Meteor.userId()) {
      FlowRouter.go('Auth.startup');
    }
  });
});

Template.App_body.onRendered(function() {
  this.autorun(() => {
    if (FlowRouter.getRouteName() === 'Events.list') {
      if (Meteor.isCordova) {
        StatusBar.backgroundColorByHexString('#e9e5dd');
      }
      $('.map-container').css('-webkit-filter', 'blur(10px)');
      $('.events-page-header').css('background-color', 'transparent');
    } else if (FlowRouter.getRouteName() === 'Events.map') {
      if (Meteor.isCordova) {
        StatusBar.backgroundColorByHexString('#f2efea');
      }
      $('.events-page-header').css('background-color', 'rgba(255,255,255,0.4)');
      $('.map-container').css('-webkit-filter', 'none');
    } else {
      $('.map-container').css('-webkit-filter', 'none');
      $('.events-page-header').css('background-color', 'inherit');
    }
    if (FlowRouter.getRouteName() === 'Users.profile') {
      $('#scrolling-content-container').css('overflow-y', 'hidden');      
    } else {
      $('#scrolling-content-container').css('overflow-y', 'scroll');
    }
  });
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
