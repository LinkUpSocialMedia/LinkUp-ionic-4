import './messages-chat.html';

import { Template } from 'meteor/templating';
import { Messages } from '../../api/messages/messages.js';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

Template.Messages_chat.onCreated(function() {
  this.subscribe('messages.inUser');
});

Template.Messages_chat.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#3b9845');
  }
  $('#content-container').css('margin-bottom', '49px');
  $('.tabs.tabs-icon-only').css('display', 'flex');
});

Template.Messages_chat.helpers({
  messageGroups() {
    console.log(Messages.find().fetch());
  },
});
