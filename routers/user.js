const {getCurrentTimeYYYYMMDDSS} = require("../utility/time-utility");
const {v4} = require("uuid")


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
        let user
        if (result.length < 1){
            user = {
                _id: v4(),
                email: context.userInfo.email,
                IDP: context.userInfo.IDP,
                userStatus: "Active",
                role: "User",
                organizations: [],
                firstName: context.userInfo.firstName,
                lastName: context.userInfo.lastName,
                createdAt: getCurrentTimeYYYYMMDDSS(),
                updateAt: getCurrentTimeYYYYMMDDSS()
                }
            await this.userCollection.insert(user);
        }
        else{
            user =  result[0];
        }
        // if (result.matchedCount < 1) throw new Error(ERROR.APPLICATION_NOT_FOUND+id);
        if (result.matchedCount < 1) throw (conso.log('there is an error getting result'))
        context.userInfo = {
            ...user,
            ...context.userInfo
        }
        return user
    }
        
}


module.exports = {
    User
}