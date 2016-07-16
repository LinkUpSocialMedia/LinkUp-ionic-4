import './auth-create.html';

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Slingshot } from 'meteor/edgee:slingshot';

import '../../api/avatars/avatars.js';

Template.Auth_create.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    avatar: '',
    imageLoaded: false,
    avatarErrors: true,
    nameErrors: true,
    formErrors: true,
  });

  if (Meteor.isCordova) {
    StatusBar.backgroundColorByHexString('#fff');
    Keyboard.shrinkView(true);
  }
});

Template.Auth_create.helpers({
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

    if (!instance.state.get('avatarErrors') && !instance.state.get('nameErrors')) {
      instance.state.set('formErrors', false);
      return true;
    }
  },
});

Template.Auth_create.events({
  'change #create-avatar'(event, instance) {
    event.preventDefault();

    const file = document.getElementById('create-avatar').files[0];
    const url = URL.createObjectURL(file);

    instance.state.set('avatar', url);
    instance.state.set('imageLoaded', true);
    instance.state.set('avatarErrors', false);
  },
  'input #name'(event, instance) {
    const name = event.target.value;

    if (!!name) {
      instance.state.set('nameErrors', false);
    } else {
      instance.state.set('nameErrors', true);
    }
  },
  'submit #create-form'(event, instance) {
    event.preventDefault();

    if (!instance.state.get('formErrors')) {
      const name = event.target.name.value;
      const image = document.getElementById('create-avatar').files[0];
      const email = Session.get('joinEmail');
      const password = Session.get('joinPassword');

      let errors = false;

      if (!name) {
        errors = true;
      }
      if (!image) {
        errors = true;
      }

      if (!errors) {
        Meteor.call('users.register', { email, password });
        Meteor.loginWithPassword(email, password);

        const uploader = new Slingshot.Upload('avatarUploads');

        uploader.send(image, (error, downloadUrl) => {
          if (error) {
            // console.log('Error uploading', uploader.xhr.response);
            console.log(error);
          } else {
            const avatar = downloadUrl;
            Meteor.call('users.update', { name, avatar });
            FlowRouter.go('Events.list');
          }
        });
      }
    }
  },
});
