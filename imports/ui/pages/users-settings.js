import './users-settings.html';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Users_settings.onCreated(function() {
  // this.autorun(() => {
  //   this.subscribe('users.current');
  // });
});

Template.Users_settings.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#fff');
  }
});

Template.Users_settings.helpers({
  userName() {
    return Meteor.users.findOne().name;
  },
  userEmail() {
    return Meteor.users.findOne().email;
  },
});

Template.Users_settings.events({
  'click .js-logout'() {
    Meteor.logout();
  }
});
