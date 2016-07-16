import './auth-join.html';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';

Template.Auth_join.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    passwordText: '',
    reveal: false,
    emailErrors: true,
    passwordErrors: true,
    formErrors: true,
    password: '',
  });
  if (Meteor.isCordova) {
    Keyboard.shrinkView(true);
  }
  Session.set('formErrors', false);
});

Template.Auth_join.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#fff');
  }
});

Template.Auth_join.helpers({
  password() {
    if (!!Session.get('joinPassword')) {
      return 'password'
    }
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
  ready() {
    const instance = Template.instance();

    if (!instance.state.get('emailErrors') && !instance.state.get('passwordErrors')) {
      instance.state.set('formErrors', false);
      return true;
    } else if (!!Session.get('joinEmail') && !!Session.get('joinPassword')) {
      instance.state.set('formErrors', false);
      return true;
    }
  },
  joinEmail() {
    return Session.get('joinEmail');
  },
  joinPassword() {
    return Session.get('joinPassword');
  },
});

Template.Auth_join.events({
  'input #password'(event, instance) {
    if (event.target.value.length > 0) {
      instance.state.set('passwordText', 'password');
    } else {
      instance.state.set('passwordText', '');
    }
  },
  'click .js-reveal-password'(event, instance) {
    instance.state.set('reveal', true);
  },
  'click .js-hide-password'(event, instance) {
    instance.state.set('reveal', false);
  },
  'submit #join-form'(event, instance) {
    event.preventDefault();

    if (!instance.state.get('formErrors')) {
      const email = event.target.email.value;
      const password = event.target.password.value;
      const repeat = event.target.repeat.value;

      Session.set('joinEmail', email);
      Session.set('joinPassword', password);

      FlowRouter.go('Auth.create');
    }
  },
  'input #email'(event, template) {
    const email = event.target.value;
    if (!!email && email.includes('@') && email.includes('.edu')) {
      template.state.set('emailErrors', false);
    }
  },
  'blur #password'(event, template) {
    const password = event.target.value;
    template.state.set('password', password);
  },
  'input #repeat'(event, template) {
    const repeat = event.target.value;
    if (!!repeat && repeat === template.state.get('password')) {
      template.state.set('passwordErrors', false);
    }
  },
});
