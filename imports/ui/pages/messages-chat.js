import './messages-chat.html';

import { Template } from 'meteor/templating';
import { Messages } from '../../api/messages/messages.js';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

Template.Messages_chat.onCreated(function() {
  this.subscribe('messages.ofUser');

  // this.autorun(() => {
  //   this.subscribe('users.current');
  // });
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
    const messages = Messages.find().fetch();

    let grouped = [];
    let messageGroupIds = [];

    messages.forEach((message) => {
      if (messageGroupIds.indexOf(message.messageGroupId) === -1) {
        grouped.push(message);
        messageGroupIds.push(message.messageGroupId);
      }
    });

    return grouped;
  },
});

Template.Messages_chat.events({
  'click .message-group-card'() {
    if (this.message.senderId === Meteor.userId()) {
      Session.set('messageId', this.message.receiverId);
      Session.set('messageName', this.message.receiverName);
    } else {
      Session.set('messageId', this.message.senderId);
      Session.set('messageName', this.message.senderName);
    }
    FlowRouter.go('Messages.convo');
  },
});

Template.Message_group.helpers({
  avatar() {
    const user = Meteor.users.findOne();

    if (user._id === this.message.senderId) {
      return this.message.receiverAvatar;
    }
    return this.message.senderAvatar;
  },
  name() {
    const user = Meteor.users.findOne();

    if (user._id === this.message.senderId) {
      return this.message.receiverName;
    }
    return this.message.senderName;
  },
  time() {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    let diff = currentTime - this.message.time.getTime();
    let hh = Math.floor(diff / 1000 / 60 / 60);
    diff -= hh * 1000 * 60 * 60;
    let mm = Math.floor(diff / 1000 / 60);
    diff -= mm * 1000 * 60;
    let ss = Math.floor(diff / 1000);
    diff -= ss * 1000;
    if (hh > 23) {
      let days = Math.floor(hh / 24);
      return days + ' days ago';
    } else if (hh > 0) {
      if (hh === 1) {
        return hh + 'hour ago';
      }
      return hh + ' hours ago';
    } else if (mm > 0) {
      return mm + ' minutes ago';
    } else {
      return 'just now';
    }
  },
});
