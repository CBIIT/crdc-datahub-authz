const {buildSchema} = require('graphql');
const {createHandler} = require("graphql-http/lib/use/express");
const config = require("../config");
const {MongoDBCollection} = require("../crdc-datahub-database-drivers/mongodb-collection");
const {DATABASE_NAME, USER_COLLECTION, LOG_COLLECTION, ORGANIZATION_COLLECTION} = require("../crdc-datahub-database-drivers/database-constants");
const {DatabaseConnector} = require("../crdc-datahub-database-drivers/database-connector");
const {User} = require("../crdc-datahub-database-drivers/services/user")
const {Organization} = require("../crdc-datahub-database-drivers/services/organization")

const schema = buildSchema(require("fs").readFileSync("resources/graphql/authorization.graphql", "utf8"));
const dbConnector = new DatabaseConnector(config.mongo_db_connection_string);

let root;
dbConnector.connect().then(() => {
    const userCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, USER_COLLECTION);
    const logCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, LOG_COLLECTION);
    const organizationCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, ORGANIZATION_COLLECTION);
    const organizationService = new Organization(organizationCollection);
    const dataInterface = new User(userCollection, logCollection, organizationService);
    root = {
        getMyUser : dataInterface.getMyUser.bind(dataInterface),
        getUser : dataInterface.getUser.bind(dataInterface),
        updateMyUser : dataInterface.updateMyUser.bind(dataInterface),
        listUsers : dataInterface.listUsers.bind(dataInterface),
        editUser : dataInterface.editUser.bind(dataInterface),
        // listOrganizations : dataInterface.listOrganizations.bind(dataInterface),
        grantToken : dataInterface.grantToken.bind(dataInterface),
    };
});
module.exports = (req, res) => {
    createHandler({
        schema: schema,
        rootValue: root,
        context: req.session
    })(req,res);
};
