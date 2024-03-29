"use strict";

/*
NodeJS Mongo Driver docs and tutorial:
  https://mongodb.github.io/node-mongodb-native/
  http://mongodb.github.io/node-mongodb-native/3.1/tutorials/crud/
*/

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const moment = require("moment");

class FactStore {
  constructor(dbUrl) {
    this.dbUrl = dbUrl;
    this.dbClient = null;
    this.dbName = "til";
  }

  // Open (or reuse) a connection to the database and
  // return the MongoDB Client.
  async client() {
    if (this.dbClient && this.dbClient.isConnected()) {
      return this.dbClient;
    } else {
      // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
      console.log(`Connecting to ${this.dbUrl}...`);
      this.dbClient = await MongoClient.connect(this.dbUrl, {
        useNewUrlParser: true
      });
      console.log("Connected to database.");
      return this.dbClient;
    }
  }

  // Get the MongoDB Collection for this record type (facts).
  // Must be asynchronous because the database connection
  // might not currently be open.
  async collection() {
    const client = await this.client();
    const db = client.db(this.dbName);
    const collection = db.collection("facts");
    return collection;
  }

  // Get a sorted cursor for all facts.
  async all() {
    let collection = await this.collection();
    return collection.find({}).sort([["when", 1]]);
  }

  // Print all entries, in chronological order,
  // with a headline for each distinct date.
  async printAll() {
    let cursor = await this.all();

    let currentDay;
    await cursor.forEach(fact => {
      let when = moment(fact.when);
      let startOfDay = when.format("YYYYMMDD");
      if (!currentDay || currentDay != startOfDay) {
        console.log(when.format("MMMM Do, YYYY"));
        currentDay = startOfDay;
      }
      let output = when.format("  hh:mm a - ") + fact.text;
      console.log(output);
      return currentDay;
    });

    // this is safe but unnecessary
    // this.dbClient.close()
  }

  /*
    For each fact...
    1. if the current day has changed, prints the day 
    2. prints the time+text
    3. returns the current day, to be passed in next time around

    The result looks like this:

    July 28th, 2018
      08:45 pm - dogs like to bark
      09:17 pm - neighbors don't like barking dogs
    July 29th, 2018
      03:23 pm - chickens like corn
  */
  printEntry(fact, currentDay) {}

  // Create an entry with the given text
  //Added title
  async addFact(text, title) {
    let entry = {
      when: new Date(),
      text: text,
      title: title
    };

    let collection = await this.collection();
    let result = await collection.insertOne(entry);
    assert.equal(1, result.insertedCount); // sanity check
    console.log("Inserted fact as id " + result.insertedId);

    return { id: result.insertedId };
  }

  //Not working yet - I need to give it the unique ID from the onePost[0]._id
  async updatePost(id, text, title) {
    console.log("Updating documents...");
    let collection = await this.collection();
    try {
      // Update one of the existing documents
      let results = await collection.findOneAndUpdate(
        { id: id },
        { $set: { tile: title,
                  text: text } },
        { returnOriginal: false }
      );
      // Check to make sure that there are still three documents.
      assert.equal(title, results.value.title);
    } catch (err) {
      console.log("Something went wrong", err.name, err.stack);
    }
    console.log("Finished with everything.");
  }
}

module.exports = FactStore;
