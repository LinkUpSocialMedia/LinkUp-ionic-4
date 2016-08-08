import './messages-convo.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Messages } from '../../api/messages/messages.js';

Template.Messages_convo.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    ready: '',
  });

  this.subscribe('messages.withUser', Session.get('messageId'));
  // this.subscribe('messages.byGroupId', Session.get('messageGroupId'));
  // console.log(Session.get('messageGroupId'));
});

Template.Messages_convo.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#f7f7f7');
    Keyboard.shrinkView(true);
    window.addEventListener('keyboardDidShow', () => {
      const objDiv = document.getElementById("messages-scroll");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
  }
  $('#content-container').css('margin-bottom', '0px');
  $('.tabs.tabs-icon-only').css('display', 'none');
});

Template.Messages_convo.helpers({
  ready() {
    return Template.instance().state.get('ready');
  },
  messages() {
    console.log(Messages.find().fetch());
    return Messages.find();
  },
  owned(senderId) {
    const objDiv = document.getElementById("messages-scroll");
    objDiv.scrollTop = objDiv.scrollHeight;

    if (senderId === Meteor.userId()) {
      return 'owned';
    }
  },
  chatUser() {
    let name = Session.get('messageName');
    let first = name.split(' ', 1);

    return first;
  },
});

Template.Messages_convo.events({
  'input #messageText'(event, instance) {
    if (event.target.value.length > 0) {
      instance.state.set('ready', 'ready');
    } else {
      instance.state.set('ready', '');
    }
  },
  'submit #send-message'(event, instance) {
    event.preventDefault();

    const receiverId = Session.get('messageId');
    const message = event.target.messageText.value;

    Meteor.call('messages.send', { message, receiverId });

    event.target.messageText.value = '';
    instance.state.set('ready', '');
  },
});
