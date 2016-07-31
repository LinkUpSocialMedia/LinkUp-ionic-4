import './events-details.html';

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Comments } from '../../api/comments/comments.js';

Template.Events_details.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    showForm: '',
    user: {},
    charCount: 200,
    addingComment: false,
    ready: false,
    showAdd: '',
  });

  this.autorun(() => {
    this.subscribe('users.current');
  });
  this.autorun(() => {
    this.state.set('user', Meteor.users.findOne());
  });
  this.autorun(() => {
    this.subscribe('comments.ofEvent', Session.get('eventDetails')._id);
  });
});

Template.Events_details.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#fff');
    Keyboard.shrinkView(false);
  }
});

Template.Events_details.helpers({
  charCount() {
    const instance = Template.instance();
    return instance.state.get('charCount');
  },
  events() {
    return [Session.get('eventDetails')];
  },
  totalComments() {
    return 0;
  },
  eventDate(date) {
    const options = {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  },
  lastRoute() {
    return Session.get('lastRoute');
  },
  inEvent() {
    const user = Meteor.users.findOne();
    console.log(user.events.indexOf(Session.get('eventDetails')._id));
    if (user.events.indexOf(Session.get('eventDetails')._id) != -1) {
      return true;
    }
  },
  ownEvent() {
    const user = Meteor.users.findOne();
    console.log(user.created);
    if (user.created.indexOf(Session.get('eventDetails')._id) != -1) {
      return true;
    }
  },
  showForm() {
    return Template.instance().state.get('showForm');
  },
  comments() {
    let comments = Comments.find().fetch();

    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    let commentsWithTime = comments.map((comment) => {
      let diff = currentTime - comment.dateCreated.getTime();
      let hh = Math.floor(diff / 1000 / 60 / 60);
      diff -= hh * 1000 * 60 * 60;
      let mm = Math.floor(diff / 1000 / 60);
      diff -= mm * 1000 * 60;
      let ss = Math.floor(diff / 1000);
      diff -= ss * 1000;
      if (hh > 23) {
        let days = Math.floor(hh / 24);
        comment.time = days + ' days ago';
      } else if (hh > 0) {
        comment.time = hh + ' hours ago';
      } else if (mm > 0) {
        comment.time = mm + ' minutes ago';
      } else {
        comment.time = 'just now';
      }
      return comment;
    });
    return commentsWithTime;
  },
  noComments() {
    const comments = Comments.find().count();
    console.log(comments);
    if (comments === 0) {
      return true;
    }
    return false;
  },
  showAdd() {
    return Template.instance().state.get('showAdd');
  },
  ready() {
    return Template.instance().state.get('ready');
  },
});

Template.Events_details.events({
  'click .js-join-event'() {
    // joinEvent.call({
    //   eventId: Session.get('eventDetails')._id,
    // });
    Meteor.call('users.joinEvent', { eventId: Session.get('eventDetails')._id });
    FlowRouter.go('Users.links');
  },
  'click .js-leave-event'() {
    // joinEvent.call({
    //   eventId: Session.get('eventDetails')._id,
    // });
    Meteor.call('users.leaveEvent', { eventId: Session.get('eventDetails')._id });
    FlowRouter.go(Session.get('lastRoute'));
  },
  'click .js-cancel-event'() {
    // joinEvent.call({
    //   eventId: Session.get('eventDetails')._id,
    // });
    Meteor.call('events.remove', { eventId: Session.get('eventDetails')._id });
    FlowRouter.go(Session.get('lastRoute'));
  },
  'click .js-comments'(event, instance) {
    instance.state.set('showForm', 'show-form');
    if (Meteor.isCordova) {
      StatusBar.backgroundColorByHexString('#b3b3b3');
    }
  },
  'click .js-close-comments'(event, instance) {
    instance.state.set('showForm', '');
    if (Meteor.isCordova) {
      StatusBar.backgroundColorByHexString('#fff');
    }
  },
  'click .js-add-comment'(event, instance) {
    instance.state.set('showAdd', 'show-add');
  },
  'click .js-cancel-comment'(event, instance) {
    instance.state.set('showAdd', '');
  },
  'submit #add-comment'(event, instance) {
    event.preventDefault();

    const user = instance.state.get('user');

    const eventId = Session.get('eventDetails')._id;
    const message = event.target.message.value;
    const name = user.name;
    const avatar = user.avatar;

    const comment = {
      eventId,
      message,
      name,
      avatar,
    };

    Meteor.call('comments.insert', comment);
    instance.state.set('showAdd', '');
  },
  'input #comment-message'(event, instance) {
    const charMax = 200;
    instance.state.set('charCount', charMax - event.target.value.length);
    if (event.target.value.length > 0) {
      instance.state.set('ready', true);
    }
  },
});

Template.Comment_card.helpers({
  liked() {
    const likes = this.comment.likes;
    if (likes.indexOf(Meteor.userId()) !== -1) {
      return '';
    }
    return '-outline';
  },
});
Template.Comment_card.events({
  'click .js-like-comment'(event, instance) {
    Meteor.call('comments.like', { commentId: this.comment._id });
  },
});
