import React from "react";

//Doesn't work yet. The form now updates and sets its value from the state
//Add a button for changing the editPost state to hide this component until the user clicks edit
//Once open add a cancel button to change the state back to false and hide the form
class EditPost extends React.Component {
  render() {
    return (
      <div>
        <form onSubmit={this.handleUpdate}>
          <label htmlFor="updatedTitle">Title</label>
          <input
            type="text"
            id="updatedTitle"
            name="updatedTitle"
            value={this.props.updatedTitle}
            onChange={this.props.handleChange}
          />
          <br />
          <label htmlFor="updatedFact">Fact</label>
          <input
            type="text"
            id="updatedFact"
            name="updatedFact"
            value={this.props.updatedFact}
            onChange={this.props.handleChange}
          />
          <br />
          <input type="submit" />
        </form>{" "}
      </div>
    );
  }
}

export default EditPost;
