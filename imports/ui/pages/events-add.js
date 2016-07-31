import './events-add.html';

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import { Events } from '../../api/events/events.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Slingshot } from 'meteor/edgee:slingshot';
import { $ } from 'meteor/jquery';

import '../../api/avatars/avatars.js';

Template.Events_add.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    charCount: 250,
    avatar: '',
    imageLoaded: false,
    addressInput: false,
    ready: false,
    loading: false,
  });

  if (Meteor.isCordova) {
    Keyboard.shrinkView(true);
    StatusBar.backgroundColorByHexString('#fff');
  }
});

Template.Events_add.onRendered(function() {
  this.autorun(() => {
    if (GoogleMaps.loaded()) {
      $('#event-address').geocomplete({
        location: new google.maps.LatLng(44.468195, -73.196322),
      });
    }
  });
});

Template.Events_add.helpers({
  minDate() {
    const date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }

    return date.getFullYear() + '-' + month + '-' + date.getDate();
  },
  image() {
    const instance = Template.instance();
    return instance.state.get('avatar');
  },
  loaded() {
    const instance = Template.instance();
    return instance.state.get('imageLoaded');
  },
  charCount() {
    const instance = Template.instance();
    return instance.state.get('charCount');
  },
  addressInput() {
    return Template.instance().state.get('addressInput');
  },
  ready() {
    return Template.instance().state.get('ready');
  },
  lastRoute() {
    return Session.get('lastRoute');
  },
  loading() {
    return Template.instance().state.get('loading');
  },
});

Template.Events_add.events({
  'change #create-avatar'(event, instance) {
    event.preventDefault();

    instance.state.set('imageError', '');

    const file = document.getElementById('create-avatar').files[0];
    const url = URL.createObjectURL(file);

    instance.state.set('avatar', url);
    instance.state.set('imageLoaded', true);
  },
  'submit #insert-event'(event, instance) {
    event.preventDefault();

    const name = event.target.name.value;
    const description = event.target.description.value;
    const date = event.target.date.value;
    let time = event.target.time.value;
    const address = event.target.address.value;
    const avatar = document.getElementById('create-avatar').files[0];

    let errors = false;

    if (!name) {
      errors = true;
    }
    if (!description) {
      errors = true;
    }
    if (!date) {
      errors = true;
    }
    if (!time) {
      errors = true;
    }
    if (!address) {
      errors = true;
    }
    if (!avatar) {
      errors = true;
    }

    time = 'T' + time + ':00';

    const dateOccuring = new Date(date+time);

    const eventToAdd = {
      name,
      description,
      address,
      dateOccuring,
    };

    if (!errors) {
      instance.state.set('loading', true);
      $('#events-add').css({
        'filter': 'blur(5px)',
        '-webkit-filter': 'blur(5px)',
        '-moz-filter': 'blur(5px)',
        '-o-filter': 'blur(5px)',
        '-ms-filter': 'blur(5px)',
      });
      $('.tabs.tabs-icon-only').css({
        'background-color': '#999',
        'border-color': '#999',
      });
      $('.tabs.tabs-icon-only .tab-item').css({
        'filter': 'blur(5px)',
        '-webkit-filter': 'blur(5px)',
        '-moz-filter': 'blur(5px)',
        '-o-filter': 'blur(5px)',
        '-ms-filter': 'blur(5px)',
      });
      if (Meteor.isCordova) {
        StatusBar.backgroundColorByHexString('#999');
      }

      const uploader = new Slingshot.Upload('eventAvatarUploads');
      uploader.send(avatar, (error, downloadUrl) => {
        if (error) {
          console.log('Error uploading', uploader.xhr.response);
          console.log(error);
        } else {
          eventToAdd.avatar = downloadUrl;
          Meteor.call('events.insert', eventToAdd);
          function changeRoute() {
            $('.tabs.tabs-icon-only').css({
              'background-color': 'white',
              'border-color': 'white',
            });
            $('.tabs.tabs-icon-only .tab-item').css({
              'filter': 'blur(0px)',
              '-webkit-filter': 'blur(0px)',
              '-moz-filter': 'blur(0px)',
              '-o-filter': 'blur(0px)',
              '-ms-filter': 'blur(0px)',
            });
            FlowRouter.go('Events.list');
          }
          Meteor.setTimeout(changeRoute, 500);
        }
      });
    }
  },
  'input #event-address'(event, instance) {
    $(document).on({
      'DOMNodeInserted': function() {
        $('.pac-item, .pac-item span', this).addClass('needsclick');
      }
    }, '.pac-container');
    if (event.target.value.length > 0) {
      instance.state.set('addressInput', true);
    }
  },
  'click .js-clear-address'(event) {
    event.target.offsetParent.firstElementChild.value = '';
  },
  'input #event-description'(event, instance) {
    const charMax = 250;
    instance.state.set('charCount', charMax - event.target.value.length);
  },
  'input #event-time'(event, instance) {
    const time = event.target.value;
    const name = document.getElementById('event-name').value;
    const avatar = document.getElementById('create-avatar').value;
    const description = document.getElementById('event-description').value;
    const address = document.getElementById('event-address').value;
    const date = document.getElementById('event-date').value;

    if (!!time && !!name && !!avatar && !!description && !!address && !!date) {
      instance.state.set('ready', true);
    }
  },
});
