import React from "react";
import { Field, reduxForm } from 'redux-form';

class URLForm extends React.Component {
  // render
  render() {
    return (
      <form onSubmit={inputUrl}>
        <label htmlFor="url">URL</label>
        <Field name="url" component="input" type="text" />
      </form>
    );
  }
}

URLForm = reduxForm({
  // a unique name for the form
  form: 'contact'
})(URLForm);

export default URLForm;
