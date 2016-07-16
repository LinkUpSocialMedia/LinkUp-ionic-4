import './auth-startup.html';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

Template.Auth_startup.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    'started': 'started',
  });
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#99ca3c');
  }
  Session.set('joinPassword', '');
  Session.set('joinEmail', '');
});

Template.Auth_startup.helpers({
  started() {
    const instance = Template.instance();
    const delay = () => {
      instance.state.set('started', '');
    };

    if (Session.get('started')) {
      return 'after';
    } else {
      Meteor.setTimeout(delay, 4500);
      return instance.state.get('started');
    }
  },
});

Template.Auth_startup.events({
  'click .js-join'() {
    FlowRouter.go('Auth.join');
    Session.set('started', true)
  },
  'click .js-login'() {
    FlowRouter.go('Auth.login');
    Session.set('started', true)
  },
});
