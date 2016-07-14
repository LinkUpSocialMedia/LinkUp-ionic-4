import './auth-create.html';

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { Slingshot } from 'meteor/edgee:slingshot';

import '../../api/avatars/avatars.js';

Template.Auth_create.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    avatar: '',
    imageLoaded: false,
    nameError: false,
    imageError: false,
    imageErrorMessage: '',
    uploadError: false,
  });
  this.autorun(() => {
    this.subscribe('users.current');
  });
  if (!!Meteor.users.findOne().avatar) {
    FlowRouter.go('Events.list');
  }
});

Template.Auth_create.helpers({
  nameError() {
    const instance = Template.instance();
    return instance.state.get('nameError');
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
});

Template.Auth_create.events({
  'change #create-avatar'(event, instance) {
    event.preventDefault();

    instance.state.set('imageError', false);

    const file = document.getElementById('create-avatar').files[0];
    const url = URL.createObjectURL(file);

    instance.state.set('avatar', url);
    instance.state.set('imageLoaded', true);
  },
  'submit #create-auth'(event, instance) {
    event.preventDefault();

    const name = event.target.name.value;
    const avatar = document.getElementById('create-avatar').files[0];

    let errors = false;

    if (!name) {
      errors = true;
      instance.state.set('nameError', true);
    }
    if (!avatar) {
      errors = true;
      instance.state.set('imageError', true);
      instance.state.set('imageErrorMessage', 'You must choose an avatar!');
    }

    if (!errors) {
      const uploader = new Slingshot.Upload('avatarUploads');

      uploader.send(avatar, (error, downloadUrl) => {
        if (error) {
          console.log('Error uploading', uploader.xhr.response);
          console.log(error);
          instance.state.set('imageError', true);
          instance.state.set('imageErrorMessage', 'Upload failed, try different image!');
        } else {
          Meteor.call('users.update', {
            name,
            avatar: downloadUrl,
          });
          FlowRouter.go('Events.list');
        }
      });
    }
  },
  'keypress #create-name'(event, instance) {
    instance.state.set('nameError', false);
  },
});
