import './users-profile.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { $ } from 'meteor/jquery';

Template.Users_profile.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    showForm: '',
    avatar: '',
    imageLoaded: false,
    avatarErrors: true,
    formErrors: true,
    avatarImage: '',
    backgroundImage: '',
  });

  this.autorun(() => {
    this.subscribe('users.current');
  });
});

Template.Users_profile.onRendered(function() {
  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#3b9845');
  }
});

Template.Users_profile.helpers({
  users() {
    return Meteor.users.find();
  },
  noUserBackground() {
    const user = Meteor.users.findOne();

    if (!user.background) {
      return 'default';
    }
  },
  showForm() {
    return Template.instance().state.get('showForm');
  },
  image() {
    const instance = Template.instance();

    return instance.state.get('avatar');
  },
  loaded() {
    const instance = Template.instance();

    return instance.state.get('imageLoaded');
  },
  ready() {
    const instance = Template.instance();

    if (!instance.state.get('avatarErrors')) {
      instance.state.set('formErrors', false);
      return true;
    }
  },
});

Template.Users_profile.events({
  'click .js-add-background'(event, instance) {
    instance.state.set('showForm', 'show-form');
  },
  'submit #add-background'(event, instance) {
    event.preventDefault();

  },
  'click .js-close-form'(event, instance) {
    instance.state.set('showForm', '');
  },
  'change #background-image'(event, instance) {
    event.preventDefault();

    const file = document.getElementById('background-image').files[0];
    const url = URL.createObjectURL(file);

    instance.state.set('avatar', url);
    instance.state.set('imageLoaded', true);
    instance.state.set('avatarErrors', false);
  },
  'submit #add-background-form'(event, instance) {
    event.preventDefault();

    if (!instance.state.get('formErrors')) {
      const image = document.getElementById('background-image').files[0];

      let errors = false;

      if (!image) {
        errors = true;
      }

      if (!errors) {
        const uploader = new Slingshot.Upload('backgroundUploads');

        uploader.send(image, (error, downloadUrl) => {
          if (error) {
            // console.log('Error uploading', uploader.xhr.response);
            console.log(error);
          } else {
            const background = downloadUrl;
            Meteor.call('users.addBackground', { background });
            // $('#background-cover').css('background-image', 'url('+background+')');
            instance.state.set('showForm', '');
          }
        });
      }
    }
  },
});
