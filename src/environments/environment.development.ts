// Development settings. Swapped in for environment.ts by `fileReplacements` in angular.json.
export const environment = {
  production: false,
  // Empty on purpose: requests go to /api on the dev server, and proxy.conf.json
  // forwards them to the .NET API on http://localhost:5119.
  apiBaseUrl: '',
};
