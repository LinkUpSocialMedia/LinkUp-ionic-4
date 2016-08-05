import './users-links.html';
import '../components/link-card.js';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

import { Events } from '../../api/events/events.js';

Template.Users_links.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    currentEvent: '',
    showList: '',
    showForm: '',
    miniUser: {},
  });

  this.subscribe('events.withUser');

  this.autorun(() => {
    this.subscribe('users.inEvent', this.state.get('currentEvent'));
  });

  // this.autorun(() => {
  //   this.subscribe('users.current');
  // });
});

Template.Users_links.onRendered(function() {
  this.autorun(() => {
    $('.link-user-list').css('display', 'none');
    $('#'+this.state.get('currentEvent')).css('display', 'block');
  });
});

Template.Users_links.helpers({
  linksExist() {
    const userEvents = Meteor.users.findOne().events;

    console.log(userEvents);

    if (userEvents.length > 0) {
      return true;
    }
  },
  links() {
    const events = Events.find().fetch();
    const userEvents = Meteor.users.findOne(Meteor.userId()).events;

    eventsInBoth = [];

    events.forEach((event) => {
      if (userEvents.indexOf(event._id) != -1) {
        eventsInBoth.push(event);
      }
    });

    return eventsInBoth;
    // return Events.find();
  },
  eventUsers() {
    const users = Meteor.users.find().fetch();

    function removeSelf(user) {
      if (user._id === Meteor.userId()) {
        return false;
      }
      return true;
    }

    let usersNotSelf = users.filter(removeSelf);

    if (usersNotSelf === 0) {
      return [];
    }

    return usersNotSelf;
  },
  showList() {
    return Template.instance().state.get('showList');
  },
  showForm() {
    return Template.instance().state.get('showForm');
  },
  miniUser() {
    return Template.instance().state.get('miniUser');
  },
  noUserBackground() {
    const user = Template.instance().state.get('miniUser')

    if (!user.background) {
      return 'default';
    }
  },
});

Template.Users_links.events({
  'click .link-card'(event, instance) {
    instance.state.set('currentEvent', this.link._id);
    instance.state.set('showList', 'show');
  },
  'click .link-details'() {
    Session.set('eventDetails', this.link)
    Session.set('lastRoute', FlowRouter.current().path);
  },
  'click .js-mini-profile'(event, instance) {
    instance.state.set('showForm', 'show-form');
    instance.state.set('miniUser', this.user);
  },
  'click .js-close-form'(event, instance) {
    instance.state.set('showForm', '');
  },
  'click .js-message'(event, instance) {
    Session.set('messageId', instance.state.get('miniUser')._id);
    Session.set('messageName', instance.state.get('miniUser').name);

    FlowRouter.go('Messages.convo');
  },
  'click .js-add-event-link'() {
    Session.set('lastRoute', FlowRouter.current().path);
  },
});
