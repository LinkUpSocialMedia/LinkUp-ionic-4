import './messages-send.html'

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

import { Messages } from '../../api/messages/messages.js';

Template.Messages_send.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    contacts: [],
    ready: '',
    receiver: {},
  });

  this.autorun(() => {
    this.subscribe('messages.withUser', this.state.get('receiver')._id);
  });
});

Template.Messages_send.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#f7f7f7');
    Keyboard.shrinkView(true);
  }
  $('#content-container').css('margin-bottom', '0px');
  $('.tabs.tabs-icon-only').css('display', 'none');
});

Template.Messages_send.helpers({
  contacts() {
    return Template.instance().state.get('contacts');
  },
  ready() {
    return Template.instance().state.get('ready');
  },
  receiverName() {
    return Template.instance().state.get('receiver').name;
  },
  messages() {
    return Messages.find();
  },
});

Template.Messages_send.events({
  'input #contact'(event, instance) {
    if (event.target.value.length > 0) {
      Meteor.call('users.getConnections', { name: event.target.value }, (err, res) => {
        if (err) {
          console.log(err.reason);
        } else {
          instance.state.set('contacts', res);
        }
      });
    } else {
      instance.state.set('contacts', []);
    }
  },
  'click .js-choose-contact'(event, instance) {
    instance.state.set('receiver', this.contact);
    instance.state.set('contacts', []);
    $('#contact').val('');
  },
  'keyup #contact'(event, instance) {
    if (event.which === 8) {
      instance.state.set('receiver', '');
    }
  },
  'click .js-all-contacts'(event, instance) {
    Meteor.call('users.getConnections', { name: 'ALL_USER_CONTACTS'}, (err, res) => {
      if (err) {
        console.log(err.reason);
      } else {
        instance.state.set('contacts', res);
      }
    });
  },
  'input #message-text'(event, instance) {
    if (event.target.value.length > 0) {
      instance.state.set('ready', 'ready');
    } else {
      instance.state.set('ready', '');
    }
  }
});
