const {buildSchema} = require('graphql');
const {createHandler} = require("graphql-http/lib/use/express");
const config = require("../config");
const {MongoDBCollection} = require("../crdc-datahub-database-drivers/mongodb-collection");
const {DATABASE_NAME, USER_COLLECTION, LOG_COLLECTION} = require("../crdc-datahub-database-drivers/database-constants");
const {DatabaseConnector} = require("../crdc-datahub-database-drivers/database-connector");
const {User} = require("../crdc-datahub-database-drivers/services/user")
const {ERROR} = require("../crdc-datahub-database-drivers/constants/error-constants");
const {USER} = require("../crdc-datahub-database-drivers/constants/user-constants");

const schema = buildSchema(require("fs").readFileSync("resources/graphql/authorization.graphql", "utf8"));
const dbConnector = new DatabaseConnector(config.mongo_db_connection_string);

let root;
dbConnector.connect().then(() => {
    const userCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, USER_COLLECTION);
    const logCollection = new MongoDBCollection(dbConnector.client, DATABASE_NAME, LOG_COLLECTION);
    const dataInterface = new User(userCollection, logCollection);
    root = {
        getMyUser : (args, context) => {
            VerifyAuthUser
                .isLoggedInOrThrow(context);
            return dataInterface.getMyUser(args, context);
        },
        getUser : (args, context) => {
            VerifyAuthUser
                .isLoggedInOrThrow(context)
                .isAuthorizedRole(context)
                .noAssignedRole(context)
                .invalidUserID(args)
            return dataInterface.getUser(args, context)
        },
        updateMyUser : (args, context) => {
            VerifyAuthUser
                .isLoggedInOrThrow(context);
            return dataInterface.updateMyUser(args, context)
        },
        listUsers : (args, context) => {
            VerifyAuthUser
                .isLoggedInOrThrow(context)
                .isAuthorizedRole(context)
                .noAssignedRole(context);
            return dataInterface.listUsers(args, context)
        }
    };
});

class VerifyAuthUser {
    static isLoggedInOrThrow = (context) => {
        if (!context?.userInfo?.email || !context?.userInfo?.IDP) throw new Error(ERROR.NOT_LOGGED_IN);
        return this;
    }

    static invalidUserID = (args) => {
        if (!args?.userID) {
            throw new Error(ERROR.INVALID_USERID);
        }
        return this;
    }

    static isAuthorizedRole = (context) => {
        if (context?.userInfo?.role !== USER.ROLES.ADMIN && context?.userInfo.role !== USER.ROLES.ORG_OWNER) {
            throw new Error(ERROR.INVALID_ROLE);
        }
        return this;
    }

    static noAssignedRole = (context) => {
        if (context?.userInfo?.role === USER.ROLES.ORG_OWNER && !context?.userInfo?.organization?.orgID) {
            throw new Error(ERROR.NO_ORG_ASSIGNED);
        }
        return this;
    }
}

module.exports = (req, res) => {
    createHandler({
        schema: schema,
        rootValue: root,
        context: req.session
    })(req,res);
};
