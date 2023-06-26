const {buildSchema} = require('graphql');
const {createHandler} = require("graphql-http/lib/use/express");
const config = require("../config");
/*const {MongoQueries} = require("../crdc-datahub-database-drivers/mongo-queries");
const {DATABASE_NAME, USERS_COLLECTION} = require("../crdc-datahub-database-drivers/database-constants");*/

const mongoose = require('mongoose');
const Event = require('./mongo-reader');

var uri = "mongodb://127.0.0.1:27017/User";


// const schema = buildSchema(require("fs").readFileSync("resources/graphql/user_test.graphql", "utf8"));
const schema = buildSchema(require("fs").readFileSync("resources/graphql/authorization.graphql", "utf8"));
// const schema = buildSchema(require("fs").readFileSync("resources/graphql/placeholder.graphql", "utf8"));

/*const mongoQueries = new MongoQueries(config.mongo_db_connection_string, DATABASE_NAME);
const usersService = new UsersService(mongoQueries, USERS_COLLECTION);*/

// crdc-datahub
const root = {
    somethin: () => {return "test"},
    date: () => {return config.version},
    events: () => {
      return Event.find()
        .then(events => {
          return events.map(event => {
            return { ...event._doc, _id: event.id };
          });
        })
        .catch(err => {
          throw err;
        });
    },
    createEvent: args => {
      const event = new Event({
        firstName: args.eventInput.firstName,
        lastName: args.eventInput.lastName,
        IDP: args.eventInput.IDP,
        email: args.eventInput.email
      });
      return event
        .save()
        .then(result => {
          console.log(result);
          return { ...result._doc, _id: result._doc._id.toString() };
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }
//    getMyUser: usersService.getMyUser.bind(usersService)
};

mongoose
  .connect(
    uri
  )
  .then(() => {
    console.log('Yes, it has connected')
  })
  .catch(err => {
    console.log(err);
  });


module.exports = (req, res) => {
    createHandler({
        schema: schema,
        rootValue: root,
        context: req.session
    })(req,res);
};
