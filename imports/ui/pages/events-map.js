import './events-map.html';
import '../components/events-view-button.js';

import { Meteor } from 'meteor/meteor';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { Template } from 'meteor/templating';
import { Events } from '../../api/events/events.js';
import { Blaze } from 'meteor/blaze';
import { GeoLocation } from 'meteor/mdg:geolocation';
import { ReactiveVar } from 'meteor/reactive-var';

Template.Events_map.onCreated(function() {
  this.autorun(() => {
    this.subscribe('events.nearby', 44.477553, -73.199853);
  });

  GoogleMaps.ready('eventMap', function(map) {
    let markers = [];
    let windows = [];

    Events.find().observe({
      added: function(doc) {
        const lat = parseFloat(doc.location.coordinates[1]);
        const lng = parseFloat(doc.location.coordinates[0]);

        const location = new google.maps.LatLng(lat, lng);

        const address = doc.address.slice(0, -11);

        const eventDate = doc.dateOccuring;
        const pad = (n) => {
          return n < 10 ? "0" + n : n;
        };
        let date = pad(eventDate.getDate()) + "/" + pad(eventDate.getMonth() + 1) + ' at ' + eventDate.toString().slice(16, -18);

        const markerContent = '<div class="item item-avatar marker-content">'+
          '<img src="'+doc.avatar+'" class="event-avatar">'+
          '<h2>'+doc.name+': <span>'+doc.createdBy+'</span></h2>'+
          '<p>'+address+'</p>'+
          '<p>'+date+'</p>'+
          '<div><a class="assertive js-details">Details</a></div>'+
        '</div>'

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
        });
        windows.push(infoWindow);

        const marker = new google.maps.Marker({
          position: location,
          title: doc.name,
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
          };
          Session.set('eventDetails', { event: event });
        });

        markers.push(marker);
        marker.setMap(map.instance);
      }
    });
  });
});

Template.Events_map.helpers({
  mapOptions() {
    if (GoogleMaps.loaded()) {
      // const location = Geolocation.latLng();
      const center = new google.maps.LatLng(44.477553, -73.199853);
      return {
        center,
        zoom: 16,
        clickableIcons: false,
      };
    }
  },
  details() {
    return Session.get('detailsShow');
  },
});

Template.Events_map.events({
  'click .js-details'(event, instance) {
    Session.set('detailsShow', 'show');
  },
});
