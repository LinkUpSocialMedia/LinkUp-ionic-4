This is the LinkUp prototype written in Meteor for Cordova!

V2

###Events
```javascript
 // $$$$$$$  Events Collection  $$$$$$$$
 // this collection schema is taken directly from my code. It specifies the key name, and then the values those keys accept. For instance, userAvatar is a String, and it must be in URL format. It could look like userAvatar: 'http://blahblah.com/' for example. Locations is an object with type and coordinates nested.

name: { type: String },
eventDescription: { type: String },
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

// $$$$$$$$  Events publications  $$$$$$$$$$$

'events.nearby', lat, lng  // subscribe to events.nearby with lat and lng. Get the events near the location specified (2 miles for now). For map and list page on my client.
'events.withUser'  // subscribe to get the events the current user is going to. I use this on the links page.

// $$$$$$$$$  Events methods  $$$$$$$$$$

'events.insert', { name, description, address, dateOccuring, avatar }  // for adding a new event. Avatar is optional (hopefully). The field types follow the schema above.
'events.remove', { eventId }  // the _id of the event to remove
```

###Comments
```javascript
// $$$$$$$$  Comments Collection $$$$$$$$
// same deal as events collection schema above

userId: { type: String, regEx: SimpleSchema.RegEx.Id },
eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
name: { type: String },
avatar: { type: String, regEx: SimpleSchema.RegEx.Url },
message: { type: String, max: 200 },
dateCreated: { type: Date },
likes: { type: [String], regEx: SimpleSchema.RegEx.Id },

// $$$$$$$$  Comments publications $$$$$$$$

'comments.ofEvent', eventId  // self explanatory

// $$$$$$$$ Comments methods $$$$$$$$

'comments.insert', { eventId, message, name, avatar }  // eventId is the _id of the event the comment is on. Avatar is the prof pic of the comment author
'comments.like', { commentId }  // commentId the _id of the comment you are liking.
```

###Users
```javascript
// operates slightly differently than the other collections as there is no schema. Publications outline each document

// $$$$$$$ Users publications $$$$$$$

'users.inEvent', eventId  // self explanatory
'users.current'  // the current user document
'users.connections'

// $$$$$$$ Users methods $$$$$$$$

'users.register', { email, password } // create the meteor account for the user. You MUST call users.update before allowing access to other parts of the app. Both Strings
'users.update', { name, avatar }  // must be called directly after users.register and before any other method or publication. Both Strings; avatar is a URL
'users.joinEvent', { eventId }  // the _id of the event to join. String.
'users.leaveEvent', { eventId }  // the _id of the event to join. String.
'users.addBackground', { background }  // add a cover photo for the profile page. String URL.
'users.addAvatar', { avatar }  // update the user's profile picture. String URL.
'users.deleteAccount'  // delete the entire user doc.
'users.getConnections', { name } // called to search the user's connections when finding someone to message. Name can be a single letter and the method will return an array of objects with a name field and _id field.
```

###Messages
```javascript
// $$$$$$$$ Messages collection $$$$$$$$

senderName: { type: String },
senderId: { type: String, regEx: SimpleSchema.RegEx.Id },
senderAvatar: { type: String, regEx: SimpleSchema.RegEx.Url },
message: { type: String },
time: { type: Date },
receiverName: { type: String },
receiverId: { type: String, regEx: SimpleSchema.RegEx.Id },
receiverAvatar: { type: String, regEx: SimpleSchema.RegEx.Url },
messageGroupId: { type: String, regEx: SimpleSchema.RegEx.Id },

// $$$$$$$$$ Messages publications $$$$$$$$

'messages.ofUser'  // return all messages the user either sent or received. I use this in the iMessage style page that lays out all your conversations. I then filter the returned array of docs into different groups by messageGroupId.
'messages.withUser', userId  // the _id of the user you are messaging. Returns the messages with one specific user.

// $$$$$$$$ Messages methods $$$$$$$$

'messages.send', { message, receiverId }  // receiverId is the _id of the person you are messaging.
```

###Images
*You will need a package to handle uploads to AWS S3.*
The profile picture uploads must be uploaded with the name in the format of:
```javascript
userId+'-profile';
```
Where userId is the _id of the user uploading the image. User profile cover photos must be in the format:
```javascript
userId+'-background';
```
Contact me for bucket and key info.
