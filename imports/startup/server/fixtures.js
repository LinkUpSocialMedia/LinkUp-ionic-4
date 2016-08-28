import { Meteor } from 'meteor/meteor';
import { Events } from '../../api/events/events.js';
import { Faker } from 'meteor/practicalmeteor:faker';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';
import { GeoCodes } from 'meteor/aldeed:geocoder';

Meteor.startup(() => {
  if (Events.find().count() === 0) {
    let user;
    const geo = new GeoCoder();

    if (!Meteor.users.findOne()) {
      options = {
        email: 'fixture@fixtures.edu',
        password: 'password',
      };
      user = Accounts.createUser(options);
    } else {
      user = Meteor.users.findOne();
    }

    Meteor.users.update(user._id, {
      $set: {
        name: 'Fixtures Guy',
        email: 'fixture@fixtures.edu',
        avatar: 'http://i.telegraph.co.uk/multimedia/archive/02830/cat_2830677b.jpg',
        connections: [],
        blocked: [],
      }
    });

    const createdBy = "Billy Bob";

    for(let i = 0; i < 10; i++) {
      const lat = 44.477553 + Random.fraction() * 0.01;
      const lng = -73.199853 + Random.fraction() * 0.01;
      const date = faker.date.future();

      let address = geo.reverse(lat, lng);

      const event = {
        name: faker.name.title(),
        eventDescription: faker.lorem.sentence(),
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        address: address[0].formattedAddress,
        avatar: faker.image.avatar(),
        dateOccuring: date,
        unixTime: date.getTime(),
        userId: user._id,
        createdBy,
        userAvatar: faker.image.avatar(),
        dateCreated: faker.date.recent(),
        usersGoing: [user._id],
        category: 'sports',
      };

      console.log(event);

      let id = Events.insert(event);
      Meteor.users.update(user._id, { $push: { events: id, created: id } });
    }
  }
});
