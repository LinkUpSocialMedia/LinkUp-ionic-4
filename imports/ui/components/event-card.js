import './event-card.html';

import { Template } from 'meteor/templating';

Template.Event_card.helpers({
  address() {
    const data = Template.instance().data.event;
    const address = data.address.slice(0, -11);
    return address;
  },
  date() {
    const eventDate = Template.instance().data.event.dateOccuring;
    const pad = (n) => {
      return n < 10 ? "0" + n : n;
    };
    let date = pad(eventDate.getDate()) + "/" + pad(eventDate.getMonth() + 1);
    return date + ' at ' + eventDate.toString().slice(16, -18);
  },
});

Template.Event_card.events({
  'click .js-details'(event, instance) {
    Session.set('detailsShow', 'show');
    Session.set('eventDetails', instance.data);
  }
});
