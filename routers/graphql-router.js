const {buildSchema} = require('graphql');
const {createHandler} = require("graphql-http/lib/use/express");
const config = require("../config");
const {MongoQueries} = require("../crdc-datahub-database-drivers/mongo-queries");
const {MongoDBCollection} = require("../crdc-datahub-database-drivers/mongodb-collection");
const {DATABASE_NAME, USER_COLLECTION} = require("../crdc-datahub-database-drivers/database-constants");
const {DatabaseConnector} = require("../crdc-datahub-database-drivers/database-connector");
const {User} = require("../crdc-datahub-database-drivers/services/user")

const schema = buildSchema(require("fs").readFileSync("resources/graphql/authorization.graphql", "utf8"));
const dbConnector = new DatabaseConnector(config.mongo_db_connection_string);

let root;
dbConnector.connect().then(() => {
    const userCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, USER_COLLECTION);
    const dataInterface = new User(userCollection);
    root = {
        getMyUser : dataInterface.getMyUser.bind(dataInterface),
        updateMyUser : dataInterface.updateMyUser.bind(dataInterface),
    };
});
module.exports = (req, res) => {
    createHandler({
        schema: schema,
        rootValue: root,
        context: req.session
    })(req,res);
};