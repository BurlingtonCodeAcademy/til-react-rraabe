import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
// import Hello from './Hello'
const pStyle = {
  color: "red"
};

const centered = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  'flexDirection': 'column'
};

const noLink = {
  'textDecoration': 'none',
  color: 'black'
}

//To add an edit see https://stackoverflow.com/questions/38078132/how-to-use-findoneandupdate-in-mongodb-in-node


class Facts extends React.Component {
  //add a fetch request to /facts

  componentDidMount() {
    //Fetch all the facts
    this.props.getFacts();
  }
  //Go to https://bootcamp.burlingtoncodeacademy.com/lessons/react/rendering-multiple-components#content
  //To learn about rendering objects using JSX
  render() {
    return this.props.allFacts.map(fact => (
      <div style={centered} key={fact["_id"]}>
        <Link style={noLink} to={"/facts/" + fact._id}>
          <h1>{fact.title}</h1>
        </Link>
        <p style={pStyle}>{fact.text}</p>
        <p>
          Posted:{" "}
          {new Date(fact.when).toLocaleString("en-US", {
            timeZone: "America/New_York"
          })}
        </p>
      </div>
    ));
  }
}

export default Facts;
