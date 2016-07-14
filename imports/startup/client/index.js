import './useraccounts-configuration.js';
import './routes.js';

import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  GoogleMaps.load({
    libraries: 'places',
    key: Meteor.settings.public.googleMapsKey,
  });
});

if (Meteor.isCordova) {
  Meteor.startup(() => {
    Keyboard.hideFormAccessoryBar(true);
    PushNotification.init({
      ios: {
        alert: "true",
        sound: "true",
        badge: "true",
      },
    });
  });
}
