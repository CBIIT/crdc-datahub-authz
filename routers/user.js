class User {
    constructor(userCollection, dbService){
        this.userCollection = userCollection
        this.dbService = dbService;

    }

    async getMyUser(parm, context) {
        console.log(context.userInfo)

        // await this.userCollection.insert(pipeline);
        const user_email = {"$match": {email: context.userInfo.email}}
        const user_idp = {"$match": {IDP: "Google"}}
        const sortCreatedAtDescending = {"$sort": {createdAt: -1}};
        const limitReturnToOneApplication = {"$limit": 1};
        const pipeline = [
            user_email,
            // user_idp,
            sortCreatedAtDescending,
            limitReturnToOneApplication
        ];
        let result = await this.userCollection.aggregate(pipeline);
        return result[0];
        
         


    }
        
}


module.exports = {
    User
}