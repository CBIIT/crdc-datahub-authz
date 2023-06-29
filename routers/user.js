const {getCurrentTimeYYYYMMDDSS} = require("../utility/time-utility");


class User {
    constructor(userCollection, dbService){
        this.userCollection = userCollection
        this.dbService = dbService;

    }

    async getMyUser(parm, context) {
        // console.log(context.userInfo)

        // await this.userCollection.insert(pipeline);
        const user_email = {"$match": {
            email: context.userInfo.email,
            IDP: context.userInfo.IDP,}}
        // const user_email = {"$match": {email: "testt@test.vom"}}
        const sortCreatedAtDescending = {"$sort": {createdAt: -1}};
        const limitReturnToOneApplication = {"$limit": 1};
        const pipeline = [
            user_email,
            // user_idp,
            sortCreatedAtDescending,
            limitReturnToOneApplication
        ];
        let result = await this.userCollection.aggregate(pipeline);
        let insertNewUser = await this.userCollection.insert({
            email: context.userInfo.email,
            IDP: context.userInfo.IDP,
            userStatus: "Active",
            role: "User",
            organizations: [],
            firstName: context.userInfo.firstName,
            lastName: context.userInfo.lastName,
            createdAt: getCurrentTimeYYYYMMDDSS(),
            updateAt: getCurrentTimeYYYYMMDDSS()

        });
        if (result.length < 1)
            return insertNewUser
        else
            return result[0];
    }
        
}


module.exports = {
    User
}