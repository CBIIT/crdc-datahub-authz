const {buildSchema} = require('graphql');
const {createHandler} = require("graphql-http/lib/use/express");
const config = require("../config");
/*const {MongoQueries} = require("../crdc-datahub-database-drivers/mongo-queries");
const {DATABASE_NAME, USERS_COLLECTION} = require("../crdc-datahub-database-drivers/database-constants");*/

const schema = buildSchema(require("fs").readFileSync("resources/graphql/user_test.graphql", "utf8"));
// const schema = buildSchema(require("fs").readFileSync("resources/graphql/placeholder.graphql", "utf8"));

/*const mongoQueries = new MongoQueries(config.mongo_db_connection_string, DATABASE_NAME);
const usersService = new UsersService(mongoQueries, USERS_COLLECTION);*/

// crdc-datahub
const root = {
    somethin: () => {return "test"},
    date: () => {return config.version},
//    getMyUser: usersService.getMyUser.bind(usersService)
};

module.exports = (req, res) => {
    createHandler({
        schema: schema,
        rootValue: root,
        context: req.session
    })(req,res);
};
