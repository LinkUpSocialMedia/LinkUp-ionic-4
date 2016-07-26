import './events-map.html';

import { Template } from 'meteor/templating';
import { Events } from '../../api/events/events.js';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../components/event-card.js';

Template.Events_map.onCreated(function() {
  this.subscribe('events.nearby', 44.478504, -73.199986);

  GoogleMaps.ready('eventMap', function(map) {
    let markers = [];
    let windows = [];

    Events.find().observe({
      added: function(doc) {
        const lat = parseFloat(doc.location.coordinates[1]);
        const lng = parseFloat(doc.location.coordinates[0]);

        const location = new google.maps.LatLng(lat, lng);

        const markerContent = '<div class="item marker-content">'+
          '<h2>'+doc.name+'</h2>'+
          '<span class="users-going"><i class="ion-ios-people"></i> '+doc.usersGoing.length+'</span>'+
        '</div>'+
        '<div class="event-details-link"><a class="js-details">Details</a></div>';

        const infoWindow = new google.maps.InfoWindow({
          content: markerContent,
          currentDataAvatar: doc.avatar,
          currentDataName: doc.name,
          currentDataCreatedBy: doc.createdBy,
          currentDataAddress: doc.address,
          currentDataDateOccuring: doc.dateOccuring,
          currentDataDescription: doc.description,
          currentDataUserAvatar: doc.userAvatar,
          currentDataId: doc._id,
          currentDataCategory: doc.category,
          currentDataUsersGoing: doc.usersGoing,
        });
        windows.push(infoWindow);

        const marker = new google.maps.Marker({
          position: location,
          title: doc.name,
          icon: Meteor.absoluteUrl('pin_icon_x30.png'),
        });

        marker.addListener('click', function() {
          windows.forEach(function(window) {
            window.close();
          });
          infoWindow.open(map.instance, marker);
          const event = {
            name: infoWindow.currentDataName,
            avatar: infoWindow.currentDataAvatar,
            createdBy: infoWindow.currentDataCreatedBy,
            address: infoWindow.currentDataAddress,
            dateOccuring: infoWindow.currentDataDateOccuring,
            description: infoWindow.currentDataDescription,
            userAvatar: infoWindow.currentDataUserAvatar,
            _id: infoWindow.currentDataId,
            category: infoWindow.currentDataCategory,
            usersGoing: infoWindow.currentDataUsersGoing,
          };
          Session.set('eventDetails', event);
        });

        markers.push(marker);
        marker.setMap(map.instance);
      }
    });
  });
});

Template.Events_map.helpers({
  events() {
    return Events.find();
  },
  mapOptions() {
    if (GoogleMaps.loaded()) {
      // const location = Geolocation.latLng();
      const center = new google.maps.LatLng(44.477553, -73.199853);
      return {
        center,
        zoom: 16,
        clickableIcons: false,
        disableDefaultUI: true,
      };
    }
  },
});

Template.Events_map.events({
  'click .event-card'(event, instance) {
    Session.set('lastRoute', FlowRouter.current().path);
    Session.set('eventDetails', this.event);
    FlowRouter.go('Events.details');
  },
  'click .js-details'() {
    Session.set('lastRoute', FlowRouter.current().path);
    FlowRouter.go('Events.details');
  },
});
