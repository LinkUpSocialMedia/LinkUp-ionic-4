import './events-add.html';

import { Meteor } from 'meteor/meteor';
import '../../api/events/methods.js';
import { Faker } from 'meteor/practicalmeteor:faker';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import { Events } from '../../api/events/events.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Slingshot } from 'meteor/edgee:slingshot';

import '../../api/avatars/avatars.js';

Template.Events_add.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    nameError: '',
    decsriptionError: '',
    addressError: '',
    dateError: '',
    timeError: '',
    imageError: '',
    imageErrorMessage: '',
    uploadError: '',
    charCount: 250,
  });
  if (Meteor.isCordova) {
    Keyboard.shrinkView(false);
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
  nameError() {
    const instance = Template.instance();
    return instance.state.get('nameError');
  },
  descriptionError() {
    const instance = Template.instance();
    return instance.state.get('descriptionError');
  },
  addressError() {
    const instance = Template.instance();
    return instance.state.get('addressError');
  },
  dateError() {
    const instance = Template.instance();
    return instance.state.get('dateError');
  },
  timeError() {
    const instance = Template.instance();
    return instance.state.get('timeError');
  },
  imageError() {
    const instance = Template.instance();
    return instance.state.get('imageError');
  },
  imageErrorMessage() {
    const instance = Template.instance();
    return instance.state.get('imageErrorMessage');
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
      instance.state.set('nameError', 'error');
    }
    if (!description) {
      errors = true;
      instance.state.set('descriptionError', 'error');
    }
    if (!date) {
      errors = true;
      instance.state.set('dateError', 'assertive');
    }
    if (!time) {
      errors = true;
      instance.state.set('timeError', 'assertive');
    }
    if (!address) {
      errors = true;
      instance.state.set('addressError', 'error');
    }
    if (!avatar) {
      errors = true;
      instance.state.set('imageError', 'assertive');
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
      const uploader = new Slingshot.Upload('eventAvatarUploads');
      uploader.send(avatar, (error, downloadUrl) => {
        if (error) {
          console.log('Error uploading', uploader.xhr.response);
          console.log(error);
          instance.state.set('imageError', 'assertive');
          instance.state.set('imageErrorMessage', 'Upload failed, try different image!');
        } else {
          eventToAdd.avatar = downloadUrl;
          Meteor.call('events.insert', eventToAdd);
          FlowRouter.go('Events.list');
        }
      });
    }
  },
  'input #event-name'(event, instance) {
    instance.state.set('nameError', '');
  },
  'input #event-description'(event, instance) {
    instance.state.set('descriptionError', '');
  },
  'input #event-address'(event, instance) {
    $(document).on({
      'DOMNodeInserted': function() {
        $('.pac-item, .pac-item span', this).addClass('needsclick');
      }
    }, '.pac-container');
    instance.state.set('addressError', '');
  },
  'click #event-date'(event, instance) {
    instance.state.set('dateError', '');
  },
  'click #event-time'(event, instance) {
    instance.state.set('timeError', '');
  },
  'click .ion-ios-close'(event, instance) {
    event.target.offsetParent.firstElementChild.value = '';
  },
  'input #event-description'(event, instance) {
    const charMax = 250;
    instance.state.set('charCount', charMax - event.target.value.length);
  }
});
