import './auth-join.html';

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/accounts-base';

Template.Auth_join.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    emailError: '',
    passwordError: '',
    passwordAgainError: '',
    emailErrorMessage: '',
    passwordErrorMessage: '',
    passwordAgainErrorMessage: '',
    joinError: false,
  });
});

Template.Auth_join.helpers({
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
  passwordAgainError() {
    const instance = Template.instance();
    return instance.state.get('passwordAgainError');
  },
  passwordAgainErrorMessage() {
    const instance = Template.instance();
    return instance.state.get('passwordAgainErrorMessage');
  },
  loginError() {
    const instance = Template.instance();
    return instance.state.get('loginError');
  },
  emailFromLogin() {
    return Session.get('loginEmail');
  },
  passwordFromLogin() {
    return Session.get('loginPassword');
  }
});

Template.Auth_join.events({
  'click .js-login'(event) {
    FlowRouter.go('login');
  },
  'submit #join-auth'(event, instance) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const passwordAgain = event.target.passwordAgain.value;

    let errors = false;

    if (!email) {
      errors = true;
      instance.state.set('emailError', 'item-stacked-label');
      instance.state.set('emailErrorMessage', 'Email required!');
    } else if (!email.includes('@')) {
      errors = true;
      instance.state.set('emailError', 'item-stacked-label');
      instance.state.set('emailErrorMessage', 'Email must be of format bob@example.edu!');
    } else if (!email.includes('.edu')) {
      errors = true;
      instance.state.set('emailError', 'item-stacked-label');
      instance.state.set('emailErrorMessage', 'Email must be .edu!');
    }
    if (!password) {
      errors = true;
      instance.state.set('passwordError', 'item-stacked-label');
      instance.state.set('passwordErrorMessage', 'Password required!');
    } else if (password.length < 7) {
      errors = true;
      instance.state.set('passwordError', 'item-stacked-label');
      instance.state.set('passwordErrorMessage', 'Password must be longer!');
    }
    if (!passwordAgain && !instance.state.get('passwordError')) {
      errors = true;
      instance.state.set('passwordAgainError', 'item-stacked-label');
      instance.state.set('passwordAgainErrorMessage', 'Please match passwords!');
    } else if (passwordAgain !== password && !instance.state.get('passwordError')) {
      errors = true;
      instance.state.set('passwordAgainError', 'item-stacked-label');
      instance.state.set('passwordAgainErrorMessage', 'Passwords must match!');
    }

    if (!errors) {
      Meteor.call('users.register', { email, password });
      Meteor.loginWithPassword(email, password);
      FlowRouter.go('create');
    }
  },
  'keypress #join-email'(event, instance) {
    instance.state.set('emailError', '');
    instance.state.set('emailErrorMessage', '');
  },
  'keypress #join-password'(event, instance) {
    instance.state.set('passwordError', '');
    instance.state.set('passwordErrorMessage', '');
  },
  'keypress #join-password-again'(event, instance) {
    instance.state.set('passwordAgainError', '');
    instance.state.set('passwordAgainErrorMessage', '');
  },
});
