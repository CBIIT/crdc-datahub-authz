const {buildSchema} = require('graphql');
const {createHandler} = require("graphql-http/lib/use/express");
const config = require("../config");
const {MongoDBCollection} = require("../crdc-datahub-database-drivers/mongodb-collection");
const {
    DATABASE_NAME, USER_COLLECTION, LOG_COLLECTION,
    ORGANIZATION_COLLECTION, SUBMISSIONS_COLLECTION,
    APPLICATION_COLLECTION,
} = require("../crdc-datahub-database-drivers/database-constants");
const {DatabaseConnector} = require("../crdc-datahub-database-drivers/database-connector");
const {User} = require("../crdc-datahub-database-drivers/services/user")
const {Organization} = require("../crdc-datahub-database-drivers/services/organization")
const {EmailService} = require("../services/email");
const {NotifyUser} = require("../services/notify-user");

const schema = buildSchema(require("fs").readFileSync("resources/graphql/authorization.graphql", "utf8"));
const dbConnector = new DatabaseConnector(config.mongo_db_connection_string);

let root;
dbConnector.connect().then(() => {
    const userCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, USER_COLLECTION);
    const logCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, LOG_COLLECTION);
    const organizationCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, ORGANIZATION_COLLECTION);
    const submissionsCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, SUBMISSIONS_COLLECTION);
    const applicationCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, APPLICATION_COLLECTION);
    const organizationInterface = new Organization(organizationCollection, userCollection, submissionsCollection, applicationCollection);
    const emailService = new EmailService(config.email_transport, config.emails_enabled);
    const notificationsService = new NotifyUser(emailService);
    const dataInterface = new User(userCollection, logCollection, organizationCollection, notificationsService, config.official_email);
    root = {
        getMyUser : dataInterface.getMyUser.bind(dataInterface),
        getUser : dataInterface.getUser.bind(dataInterface),
        updateMyUser : dataInterface.updateMyUser.bind(dataInterface),
        listUsers : dataInterface.listUsers.bind(dataInterface),
        editUser : dataInterface.editUser.bind(dataInterface),
        listActiveCurators: dataInterface.listActiveCuratorsAPI.bind(dataInterface),
        listOrganizations : organizationInterface.listOrganizationsAPI.bind(organizationInterface),
        getOrganization : organizationInterface.getOrganizationAPI.bind(organizationInterface),
        editOrganization : organizationInterface.editOrganizationAPI.bind(organizationInterface),
        createOrganization : organizationInterface.createOrganizationAPI.bind(organizationInterface),
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
