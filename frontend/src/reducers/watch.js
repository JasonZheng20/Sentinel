// users reducer
export default function users(state = {
  loaded: true,
  loadedPage: '',
  url: '',
  watchers: [],
  pn: ''
}, action) {
  switch (action.type) {
    case 'SUBMIT_WATCH_URL':
      let loading = (state.url === action.url) ? false : true;
      console.log(state.url);
      return Object.assign({}, state, {
        url: action.url,
        loading
      });

    case 'LOADED_WATCH_URL':
      return Object.assign({}, state, {
        loading: false
      });

    case 'ADD_WATCHER':
      return state;

    case 'SUBMIT_WATCHER':
      return state;

    // initial state
    default:
      return state;
  }
}
