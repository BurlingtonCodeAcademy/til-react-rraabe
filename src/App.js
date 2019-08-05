import React from "react";

import "./App.css";
import Facts from "./Facts";
import Hello from "./Hello";
import EditPost from "./EditPost";
import SingleFact from "./SingleFact";
import { Route, Link, Redirect } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allFacts: [],
      title: "",
      fact: "",
      //These aren't used yet but will store the edited post information for submission
      updatedTitle: "",
      updatedFact: ""
    };
    this.getFacts = this.getFacts.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Made general based on the name of the input. Make sure it matches the name of the state.
  handleChange(event) {
    let change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);
  }

  //This will be the handler for the post editing
  handleUpdate(event) {

  }

  handleSubmit(event) {
    event.preventDefault();
    let data = JSON.stringify({
      title: this.state.title,
      text: this.state.fact
    });
    console.log("Data is: ", data);

    return fetch("/facts", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: data
    }).then(response => {
      console.log(response);
      //This doesn't work to redirect
      return (
        <Route
          exact
          path="/"
          render={() =>
            response.status === 200 ? <Redirect to="/facts" /> : <Hello />
          }
        />
      );

      //Used this to check if I was receiving the response. 
      // if (response.status === 200) {
      //   return <Redirect to="/facts"/>
      // } else {
      //   console.log("It was something else");
      // }
    });
  }

  //Returns the single fact based on the post id
  oneFact(id) {
    const oneFact = this.state.allFacts.filter(fact => fact._id === id);
    return oneFact;
  }

  //Fetches all facts and stores them in state
  getFacts() {
    fetch("/facts")
      .then(response => response.json())
      .then(json => {
        //Returns an array of post objects sorted by the dates. Had to convert string dates to actual dates.
        json.sort((a, b) => new Date(b.when) - new Date(a.when));
        this.setState({
          allFacts: json
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <Route
          path="/"
          exact
          render={() => {
            return (
              <div className="App">
                <h1>Today I Learned</h1>
                <h2>Add a fact</h2>

                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={this.state.titleInput}
                    onChange={this.handleChange}
                  />
                  <br />
                  <label htmlFor="fact">Fact</label>
                  <input
                    type="text"
                    id="fact"
                    name="fact"
                    value={this.state.titleInput}
                    onChange={this.handleChange}
                  />
                  <br />
                  <input type="submit" />
                </form>
                <br />
                <Link to="/facts">List all entries</Link>
                <br />
                <Link to="/hello">To Hello For Testing</Link>
              </div>
            );
          }}
        />
        {/*Using this path for easy testing*/ }
        <Route path="/hello" component={Hello} />
        <Route
          exact
          path="/facts"
          render={() => (
            <Facts getFacts={this.getFacts} allFacts={this.state.allFacts} />
          )}
        />
        <Route
          path="/facts/:id"
          render={props => (
            <div>
              <SingleFact
                {...props}
                oneFact={this.oneFact(props.match.params.id)}
              />
              <EditPost
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                updatedTitle={this.state.updatedTitle}
                updatedFact={this.updatedFact}
              />
            </div>
          )}
        />
      </React.Fragment>
    );
  }
}

export default App;
