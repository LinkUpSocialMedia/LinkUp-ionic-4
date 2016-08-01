import './messages-chat.html';

import { Template } from 'meteor/templating';
import { Messages } from '../../api/messages/messages.js';
import { Meteor } from 'meteor/meteor';

import { Messages } from '../../api/messages/messages.js';

Template.Messages_chat.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#3b9845');
  }
});
