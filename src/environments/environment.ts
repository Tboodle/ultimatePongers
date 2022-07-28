// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'ultimate-pongers',
    appId: '1:628432550046:web:e3e585fa39847e3452e38f',
    databaseURL: 'https://ultimate-pongers-default-rtdb.firebaseio.com',
    storageBucket: 'ultimate-pongers.appspot.com',
    locationId: 'us-east1',
    apiKey: 'AIzaSyCQjMfIRUTVNgLFq77SDOSQpr9dAHiEokg',
    authDomain: 'ultimate-pongers.firebaseapp.com',
    messagingSenderId: '628432550046',
    measurementId: 'G-G3N5STHHNE',
  },
  production: false,
  baseUrl: 'https://us-central1-ultimate-pongers.cloudfunctions.net',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
