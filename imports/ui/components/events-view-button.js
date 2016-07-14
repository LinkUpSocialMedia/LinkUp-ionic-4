import './events-view-button.html';

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Events_view_button.helpers({
  listActive() {
    route = FlowRouter.getRouteName();

    if (route === 'Events.list') {
      return 'active';
    }
  },
  mapActive() {
    route = FlowRouter.getRouteName();

    if (route === 'Events.map') {
      return 'active';
    }
  }
});
