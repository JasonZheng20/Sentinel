import React from "react";
import { connect } from "react-redux";

// Page loaded
class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      dispatch,
      url,
      watchers,
      pn,
      loaded
    } = this.props;

    console.log(url);
    return (
      <div className="page">
        <div className="toolbar"></div>

        <object
          type="text/html"
          data={url}
          width="800px" height="600px"
          onload={injectWatch(dispatch, url)}>
        </object>
      </div>
    );
  }
}

function injectWatch(dispatch, url) {
  dispatch({
    type: 'LOADED_WATCH_URL'
  });

  // jasons code
}

function mapStateToProps(state, own_props) {
  return {
    loaded: state.watch.loaded,
    url: state.watch.url,
    watchers: state.watch.watchers,
    pn: state.watch.pn
  };
}

export default connect(mapStateToProps)(Page);
