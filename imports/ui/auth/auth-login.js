import './auth-login.html';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Auth_login.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    passwordText: '',
    reveal: false,
  });
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#fff');
    Keyboard.shrinkView(true);
  }
});

Template.Auth_login.helpers({
  password() {
    return Template.instance().state.get('passwordText');
  },
  reveal() {
    return Template.instance().state.get('reveal');
  },
  passType() {
    if (Template.instance().state.get('reveal')) {
      return 'text';
    } else {
      return 'password';
    }
  },
});

Template.Auth_login.events({
  'input #password'(event, template) {
    if (event.target.value.length > 0) {
      template.state.set('passwordText', 'password');
    } else {
      template.state.set('passwordText', '');
    }
  },
  'click .js-reveal-password'(event, template) {
    template.state.set('reveal', true);
  },
  'click .js-hide-password'(event, template) {
    template.state.set('reveal', false);
  },
  'submit #login-form'(event, template) {
    event.preventDefault();

    email = event.target.email.value;
    password = event.target.password.value;

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        console.log(err);
      } else {
        FlowRouter.go('Events.list');
      }
    });
  },
});
