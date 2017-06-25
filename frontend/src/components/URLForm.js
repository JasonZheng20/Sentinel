import React from "react";
import { Field, reduxForm } from 'redux-form';

class URLForm extends React.Component {
  // render
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="input-group">
          <Field name="url" className="form-control" component="input" type="text" />
          <button type="submit" className="btn btn-outline btn-xl page-scroll">Start Now for Free!</button>
        </div>
      </form>
    );
  }
}

URLForm = reduxForm({
  // a unique name for the form
  form: 'url'
})(URLForm);

export default { test: URLForm };
