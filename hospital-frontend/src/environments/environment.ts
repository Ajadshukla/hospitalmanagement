// Local development — proxy.conf.json forwards /api to localhost:5281
export const environment = {
  production: false,
  apiUrl: ''  // empty = relative URL, works via dev proxy
};
