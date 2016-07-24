import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/auth/auth-startup.js';
import '../../ui/auth/auth-login.js';
import '../../ui/auth/auth-more.js';
import '../../ui/auth/auth-join.js';
import '../../ui/auth/auth-create.js';
import '../../ui/layouts/app-body.js';
import '../../ui/pages/events-map.js';
import '../../ui/pages/users-links.js';
import '../../ui/pages/events-details.js';

FlowRouter.route('/', {
  name: 'Events.list',
  action() {
    BlazeLayout.render('App_body', { main: 'Events_map' });
  },
});

FlowRouter.route('/map', {
  name: 'Events.map',
  action() {
    BlazeLayout.render('App_body', { main: 'Events_map' });
  },
});

FlowRouter.route('/details', {
  name: 'Events.details',
  action() {
    BlazeLayout.render('Events_details');
  },
});

FlowRouter.route('/add-event', {
  name: 'Events.add',
  action() {
    BlazeLayout.render('App_body', { main: 'Events_add' });
  },
});

FlowRouter.route('/profile', {
  name: 'Users.profile',
  action() {
    BlazeLayout.render('App_body', { main: 'Users_profile' });
  },
});

FlowRouter.route('/links', {
  name: 'Users.links',
  action() {
    BlazeLayout.render('App_body', { main: 'Users_links' });
  },
});

FlowRouter.route('/chat', {
  name: 'Users.chat',
  action() {
    BlazeLayout.render('App_body', { main: 'Users_chat' });
  },
});

// AUTH FLOW $$$$$$$$$$$$$$

FlowRouter.route('/startup', {
  name: 'Auth.startup',
  action() {
    BlazeLayout.render('Auth_startup');
  },
});

// login flow

FlowRouter.route('/login', {
  name: 'Auth.login',
  action() {
    BlazeLayout.render('Auth_login');
  },
});

FlowRouter.route('/forgot', {
  name: 'Auth.forgot',
  action() {
    BlazeLayout.render('Auth_forgot');
  },
});

FlowRouter.route('/more', {
  name: 'Auth.more',
  action() {
    BlazeLayout.render('Auth_more');
  },
});

// sign up flow

FlowRouter.route('/join', {
  name: 'Auth.join',
  action() {
    BlazeLayout.render('Auth_join');
  },
});

FlowRouter.route('/create', {
  name: 'Auth.create',
  action() {
    BlazeLayout.render('Auth_create');
  }
});

// not found $$$$$$$$$$$$$$$$

FlowRouter.notFound = {
  name: 'NotFound',
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
