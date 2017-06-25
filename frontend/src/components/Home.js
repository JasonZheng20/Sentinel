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
        <header>
            <div id="download"  className="container">
                <div className="row">
                    <div className="col-sm-7">
                        <div className="header-content">
                            <div className="header-content-inner">
                                <h1>API Everything – Enter URl!</h1>
                                <URLForm.test onSubmit={submitUrl} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5">
                        <div className="header-content">
                            <div className="header-content-inner">
                                <h1><u>How to use</u></h1>
                                <hr />
                                <p>1. Input a URL</p>
                                <p>2. Select the HTML element you want recorded </p>
                                <p>3. Input your contact information </p>
                                <p>4. Let API Everything do the rest. We will notify you whenever that element changes. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
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
