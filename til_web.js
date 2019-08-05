/*
  Today I Learned webapp
*/
const assert = require('assert');
const FactStore = require('./lib/factStore')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(express.static('build')) // static file server
app.use(express.urlencoded({extended: true})) // all POST bodies are expected to be URL-encoded

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const store = new FactStore(dbUrl);

app.get('/facts', getAll);

async function getAll(request, response) {
  let cursor = await store.all();
  let output = [];
  cursor.forEach((entry) => {
    output.push(entry);
  }, function (err) {
    assert.equal(null, err);
    console.log("Sending " + output.length + " records to client");
    response.type('application/json')
      .send(JSON.stringify(output))
  });
}



app.use(express.json())
app.post('/facts', addFact);

async function addFact(request, response) {
 
  console.log("The request body is: ", request.body);
  let result = await store.addFact(request.body.text.trim(), request.body.title.trim())
  let output = {
    status: 'ok',
    id: result.id
  }
  response
    .type('application/json')
    .send(JSON.stringify(output))
    
}
//Not used yet. Need to add the unique ID to the body
async function updateFact(request, response) {
 
  console.log("The request body is: ", request.body);
  let result = await store.updatePost(request.body.text.trim(), request.body.title.trim())
  let output = {
    status: 'ok',
    id: result.id
  }
  response
    .type('application/json')
    .send(JSON.stringify(output))
    // .redirect('/facts')
}


app.listen(port, () => console.log(`TIL web app listening on port ${port}!`))
