import './app-body.html';
import '../components/loading.js';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';

import { Events } from '../../api/events/events.js';
import { Messages } from '../../api/messages/messages.js';

Template.App_body.onCreated(function() {
  Session.set('started', true);
  this.autorun(() => {
    if (!Meteor.userId()) {
      FlowRouter.go('Auth.startup');
    }
  });

  this.autorun(() => {
    this.subscribe('users.current');
  });

  // this.subscribe('messages.ofUser');

  this.subscribe('events.nearby', 44.478504, -73.199986);

  // Messages.find({ senderId: { $ne: Meteor.userId } }, { fields: { senderId: 1 } }).observe({
  //   added(doc) {
  //     if (FlowRouter.getRouteName() !== 'Messages.chat' || FlowRouter.getRouteName() !== 'Messages.send' || FlowRouter.getRouteName() !== 'Messages.convo') {
  //       Session.set('newMessage', true);
  //     }
  //   }
  // });

  Events.find({ userId: { $ne: Meteor.userId() } }, { fields: { name: 1 } }).observe({
    added(doc) {
      if (FlowRouter.getRouteName() !== 'Events.list') {
        Session.set('newEvent', true);
      }
    }
  });
});

Template.App_body.onRendered(function() {
  this.autorun(() => {
    if (FlowRouter.getRouteName() === 'Events.list') {
      if (Meteor.isCordova) {
        StatusBar.backgroundColorByHexString('#eaeaea');
      }
      $('.map-container').css('-webkit-filter', 'blur(10px)');
      $('.events-page-header').css('background-color', 'transparent');
    } else if (FlowRouter.getRouteName() === 'Events.map') {
      if (Meteor.isCordova) {
        StatusBar.backgroundColorByHexString('#f2efea');
      }
      $('.events-page-header').css('background-color', 'rgba(255,255,255,0.4)');
      $('.map-container').css('-webkit-filter', 'blur(0px)');
    } else {
      $('.map-container').css('-webkit-filter', 'none');
      $('.events-page-header').css('background-color', 'inherit');
    }
    if (FlowRouter.getRouteName() === 'Users.profile') {
      $('#scrolling-content-container').css('overflow-y', 'hidden');
    } else {
      $('#scrolling-content-container').css('overflow-y', 'scroll');
    }

    if (FlowRouter.getRouteName() === 'Events.list' || FlowRouter.getRouteName() === 'Events.map' || FlowRouter.getRouteName() === 'Users.links') {
      $('#content-container').css('margin-bottom', '49px');
      $('.tabs.tabs-icon-only').css('display', 'flex');
    }
  });
});

Template.App_body.helpers({
  loaded() {
    function setBackground() {
      $('.map-container').css('-webkit-filter', 'blur(10px)');
      $('.events-page-header').css('background-color', 'transparent');
    }
    if (FlowRouter.getRouteName() === 'Events.list') {
      Meteor.setTimeout(setBackground, 10);
    }
  },
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
    if (FlowRouter.getRouteName() === 'Messages.chat') {
      return true;
    }
  },
  profilePage() {
    if (FlowRouter.getRouteName() === 'Users.profile') {
      return true;
    }
  },
  newEvent() {
    return Session.get('newEvent');
  },
  // newMessage() {
  //   return Session.get('newMessage');
  // },
});

Template.App_body.events({
  'click .js-add-event-page'() {
    Session.set('lastRoute', FlowRouter.current().path);
  },
  'click .js-events-tab'() {
    Session.set('newEvent', false);
  }
});
