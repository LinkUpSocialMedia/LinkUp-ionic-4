import './chat-message.html';

import { Template } from 'meteor/templating';

Template.Chat_message.helpers({
  date() {
    const eventDate = Template.currentData().chat.dateCreated;
    const pad = (n) => {
      return n < 10 ? "0" + n : n;
    };
    let date = pad(eventDate.getDate()) + "/" + pad(eventDate.getMonth() + 1);
    return date + ' at ' + eventDate.toString().slice(16, -18);
  },
  owned() {
    if (Template.currentData().chat.userId === Meteor.userId()) {
      return 'owned';
    }
  },
  show() {
    return Session.get('showMessageTime');
  },
  long() {
    if (Template.currentData().chat.message.length > 50) {
      return 'long';
    }
  },  
});
