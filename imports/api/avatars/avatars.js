import { Slingshot } from 'meteor/edgee:slingshot';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

Slingshot.fileRestrictions("avatarUploads", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 20 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions("backgroundUploads", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 20 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.fileRestrictions("eventAvatarUploads", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 20 * 1024 * 1024 // 10 MB (use null for unlimited).
});

if (Meteor.isServer) {
  Slingshot.createDirective('avatarUploads', Slingshot.S3Storage, {
    bucket: 'linkup-avatars',
    acl: 'public-read',
    authorize() {
      if (!this.userId) {
        throw new Meteor.Error('uploads.upload.accessDenied',
          'You must be logged in to upload an avatar!');
      }
      return true;
    },
    key() {
      const user = Meteor.user();
      return user._id + '-profile';
    },
    AWSAccessKeyId: Meteor.settings.private.AWSAccessKeyId,
    AWSSecretAccessKey: Meteor.settings.private.AWSSecretAccessKey,
  });

  Slingshot.createDirective('backgroundUploads', Slingshot.S3Storage, {
    bucket: 'linkup-avatars',
    acl: 'public-read',
    authorize() {
      if (!this.userId) {
        throw new Meteor.Error('uploads.upload.accessDenied',
          'You must be logged in to upload an avatar!');
      }
      return true;
    },
    key() {
      const user = Meteor.user();
      return user._id + '-background';
    },
    AWSAccessKeyId: Meteor.settings.private.AWSAccessKeyId,
    AWSSecretAccessKey: Meteor.settings.private.AWSSecretAccessKey,
  });

  Slingshot.createDirective('eventAvatarUploads', Slingshot.S3Storage, {
    bucket: 'linkup-avatars',
    acl: 'public-read',
    authorize() {
      if (!this.userId) {
        throw new Meteor.Error('uploads.upload.accessDenied',
          'You must be logged in to upload an avatar!');
      }
      return true;
    },
    key() {
      const user = Meteor.user();
      return user._id + '-event-' + Random.id();
    },
    AWSAccessKeyId: Meteor.settings.private.AWSAccessKeyId,
    AWSSecretAccessKey: Meteor.settings.private.AWSSecretAccessKey,
  });
}
