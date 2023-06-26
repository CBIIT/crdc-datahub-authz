// import { MongoClient } from "mongodb";
var MongoClient = require('mongodb').MongoClient;


// var uri = "mongodb://wwadmin:1234abcd@127.0.0.1:27017";
var uri = "mongodb://127.0.0.1:27017/User";


const client = new MongoClient(uri);

async function run() {
  try {
    // const database = client.db("User");
    const collection_User = database.collection("User");

    // const query = { firstName: "John" };
    // const query = { firstName: "John" };
    const query = { IDP: "NIH" };

    // const result_user = await collection_User.findOne(query);
    const result_user = await collection_User.find(query);

    for await (const doc of result_user) {
        console.dir(doc);
      }
    // console.log(result_user);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
