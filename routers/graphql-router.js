const {buildSchema} = require('graphql');
const {createHandler} = require("graphql-http/lib/use/express");
const config = require("../config");
const {MongoQueries} = require("../crdc-datahub-database-drivers/mongo-queries");
const {MongoDBCollection} = require("../crdc-datahub-database-drivers/mongodb-collection");
const {DATABASE_NAME, USER_COLLECTION} = require("../crdc-datahub-database-drivers/database-constants");
const {DatabaseConnector} = require("../crdc-datahub-database-drivers/database-connector");
const {User} = require("./user")

const schema = buildSchema(require("fs").readFileSync("resources/graphql/authorization.graphql", "utf8"));
const dbService = new MongoQueries(config.mongo_db_connection_string, DATABASE_NAME);
const dbConnector = new DatabaseConnector(config.mongo_db_connection_string);

let root;
dbConnector.connect().then(() => {
    const userColletion = new MongoDBCollection(dbConnector.client, DATABASE_NAME, USER_COLLECTION);
    const dataInterface = new User(userColletion, dbService);
    root = {
        version: () => {return config.version},
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