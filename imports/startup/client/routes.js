import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import '../../ui/layouts/app-body.js';
import '../../ui/accounts/accounts-templates.js';
import '../../ui/pages/events-list.js';
import '../../ui/pages/events-map.js';
import '../../ui/pages/events-add.js';
import '../../ui/pages/events-details.js';
import '../../ui/pages/events-going.js';
import '../../ui/pages/eventChats-chat.js';
import '../../ui/pages/profile.js';
import '../../ui/pages/app-notFound.js';
import '../../ui/accounts/auth-login.js';
import '../../ui/accounts/auth-join.js';
import '../../ui/accounts/auth-create.js';

FlowRouter.route('/events/:_id', {
  name: 'Events.details',
  action() {
    BlazeLayout.render('App_body', { main: 'Events_details' });
  },
});

FlowRouter.route('/', {
  name: 'Events.list',
  action() {
    BlazeLayout.render('App_body', { main: 'Events_list' });
  },
});

FlowRouter.route('/map', {
  name: 'Events.map',
  action() {
    BlazeLayout.render('App_body', { main: 'Events_map' });
  },
});

FlowRouter.route('/add-event', {
  name: 'Events.add',
  action() {
    BlazeLayout.render('App_body', { main: 'Events_add' });
  },
});

FlowRouter.route('/profile', {
  name: 'Profile',
  action() {
    BlazeLayout.render('App_body', { main: 'Profile' });
  },
});

FlowRouter.route('/going', {
  name: 'Events.going',
  action() {
    BlazeLayout.render('App_body', { main: 'Events_going' });
  },
});

FlowRouter.route('/going/chat/:_id', {
  name: 'EventChats.chat',
  action() {
    BlazeLayout.render('App_body', { main: 'EventChats_chat' });
  },
});

FlowRouter.route('/going/chat/:_id/users', {
  name: 'EventChats.users',
  action() {
    BlazeLayout.render('App_body', { main: 'EventChats_users' });
  },
});

FlowRouter.notFound = {
  name: 'NotFound',
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('App_body', { main: 'Auth_login' });
  },
});

FlowRouter.route('/join', {
  name: 'join',
  action() {
    BlazeLayout.render('App_body', { main: 'Auth_join' });
  },
});

FlowRouter.route('/create', {
  name: 'create',
  action() {
    BlazeLayout.render('App_body', { main: 'Auth_create' });
  }
});

FlowRouter.route('/forgot', {
  name: 'forgot',
  action() {
    BlazeLayout.render('App_body', { main: 'Auth_forgot' });
  },
});

// AccountsTemplates.configureRoute('signIn', {
//   name: 'login',
//   path: '/login',
// });
//
// AccountsTemplates.configureRoute('signUp', {
//   name: 'join',
//   path: '/join',
// });
//
// AccountsTemplates.configureRoute('forgotPwd', {
//   name: 'forgot',
//   path: '/forgot-password',
// });
