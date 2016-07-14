import './profile.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Faker } from 'meteor/practicalmeteor:faker';
import { Geolocation } from 'meteor/mdg:geolocation';

Template.Profile.onCreated(function() {
  this.autorun(() => {
    this.subscribe('users.current');
  });
});

Template.Profile.helpers({
  users() {
    return [Meteor.users.findOne()];
  },
  number() {
    return Meteor.users.findOne().events.length;
  },
});

Template.Profile.events({
  'click #logout'(event) {
    Meteor.logout();
  }
});
