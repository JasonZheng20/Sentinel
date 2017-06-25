import React from "react";
import { Field, reduxForm } from 'redux-form';
import URLForm from './URLForm.js';
import Page from './Page.js';
import { connect } from "react-redux";

class Home extends React.Component {
  render() {
    const {dispatch} = this.props;
    function submitUrl(values) {
      dispatch({
        type: 'SUBMIT_WATCH_URL',
        url: values.url
      });
    }

    return (
      <div className="page-home">
        <URLForm.test onSubmit={submitUrl} />
        <Page />
      </div>
    );
  }
}

function mapStateToProps(state, own_props) {
  return {
    loaded: state.watch.loaded,
    url: state.watch.url,
    watchers: state.watch.watchers,
    pn: state.watch.pn
  };
}

export default connect(mapStateToProps)(Home);
