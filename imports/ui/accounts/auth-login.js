import './auth-login.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Template.Auth_login.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    emailError: '',
    passwordError: '',
    emailErrorMessage: '',
    passwordErrorMessage: '',
    loginError: false,
  });
});

Template.Auth_login.helpers({
  emailError() {
    const instance = Template.instance();
    return instance.state.get('emailError');
  },
  emailErrorMessage() {
    const instance = Template.instance();
    return instance.state.get('emailErrorMessage');
  },
  passwordError() {
    const instance = Template.instance();
    return instance.state.get('passwordError');
  },
  passwordErrorMessage() {
    const instance = Template.instance();
    return instance.state.get('passwordErrorMessage');
  },
  loginError() {
    const instance = Template.instance();
    return instance.state.get('loginError');
  },
});

Template.Auth_login.events({
  'click .js-join'(event) {
    FlowRouter.go('join');
  },
  'submit #login-auth'(event, instance) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    let errors = false;

    if (!email) {
      errors = true;
      instance.state.set('emailError', 'item-stacked-label');
      instance.state.set('emailErrorMessage', 'Email required!');
    }
    if (!password) {
      errors = true;
      instance.state.set('passwordError', 'item-stacked-label');
      instance.state.set('passwordErrorMessage', 'Password required!');
    }

    if (!errors) {
      Meteor.loginWithPassword(email, password, err => {
        if (err) {
          console.log(err.reason);
          instance.state.set('loginError', true);
          Session.set('loginEmail', email);
          Session.set('loginPassword', password);
        } else {
          FlowRouter.go('Events.list');
        }
      });
    }
  },
  'keypress #login-email'(event, instance) {
    instance.state.set('emailError', '');
    instance.state.set('emailErrorMessage', '');
    instance.state.set('loginError', false);
  },
  'keypress #login-password'(event, instance) {
    instance.state.set('passwordError', '');
    instance.state.set('passwordErrorMessage', '');
    instance.state.set('loginError', false);
  },
});
