This is the LinkUp prototype written in Meteor for Cordova!

### Running the app

```bash
npm install
meteor run ios-device --settings settings.json
```
```javascript
-Events Collection

name: { type: String },
description: { type: String },
location: { type: Object },
"location.type": { type: String },
"location.coordinates": { type: [Number], decimal: true },
address: { type: String },
avatar: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
dateOccuring: { type: Date },
unixTime: { type: Number },
userId: { type: String, regEx: SimpleSchema.RegEx.Id },
createdBy: { type: String },
userAvatar: { type: String, regEx: SimpleSchema.RegEx.Url },
dateCreated: { type: Date },
usersGoing: { type: [String], min: 0, regEx: SimpleSchema.RegEx.Id },
category: { type: String, },

Meteor.subscribe('events.nearby', lat, lng)
```
