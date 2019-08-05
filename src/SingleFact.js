import React from "react";
import "./App.css";



//Renders only a single fact based on the :id in the url
function SingleFact(props) {
  console.log("The props are ", props)
  console.log(props.oneFact[0])
  return (
    <div>
      <h1>{props.oneFact[0].title}</h1>
      <br/>
      <p>{props.oneFact[0].text}</p>
      <p>Posted: {new Date(props.oneFact[0].when).toLocaleString("en-US", {
            timeZone: "America/New_York"
          })}</p>
    </div>
  )
  
}

export default SingleFact;
