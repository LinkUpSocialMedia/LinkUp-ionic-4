App.info({
  name: 'LinkUp',
  description: 'Bringing social back to social media.',
  author: 'William Kniffin',
  email: 'linkupdevs@gmail.com',
  website: 'http://www.linkup-app.com/',
  id: 'com.linkUp',
  version: '0.0.2',
});

App.icons({
  // iOS
  'iphone_2x': 'resources/icons/linkup-gradient-backgroundx120.png',
  'iphone_3x': 'resources/icons/linkup-gradient-backgroundx180.png',
  'ios_settings': 'resources/icons/linkup-gradient-backgroundx29.png',
  'ios_settings_2x': 'resources/icons/linkup-gradient-backgroundx58.png',
  'ios_spotlight': 'resources/icons/linkup-gradient-backgroundx40.png',
  'ios_spotlight_2x': 'resources/icons/linkup-gradient-backgroundx80.png',
});

App.launchScreens({
  // iOS
  'iphone_2x': 'resources/splash/linkup-gradient-backgroundx640x960.png',
  'iphone5': 'resources/splash/linkup-gradient-backgroundx640x1136.png',
  'iphone6': 'resources/splash/linkup-gradient-backgroundx750x1334.png',
});

App.accessRule('https://*.googleapis.com/*');
App.accessRule('https://*.google.com/*');
App.accessRule('https://*.gstatic.com/*');
App.accessRule('http://linkup.meteorapp.com/*');
App.accessRule("*", {external: false});
App.accessRule('http://*');
App.accessRule('https://*');

App.setPreference('AutoHideSplashScreen', 'true');
App.setPreference('BackupWebStorage', 'local');
App.setPreference('Orientation', 'portrait');
App.setPreference('KeyboardDisplayRequiresUserAction', 'false');
