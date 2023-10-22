// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let port = 3000;

export const environment = {
  port: port,
  production: false,
  serverUrl: `http://localhost:${port}`,
  getNewChannelsUrl: `http://localhost/req/get-new-channels.php`,
  getNewPlaylistsUrl: `http://localhost/req/get-new-playlists.php`,
  getNewPodcastsUrl: `http://localhost/req/get-new-podcasts.php`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
