const yaml = require('js-yaml');
const fs = require('fs');
const {replaceMessageVariables} = require("../crdc-datahub-database-drivers/utility/string-utility");

class NotifyUser {

    constructor(emailService) {
        this.emailService = emailService;
        this.email_constants = undefined
        try {
            this.email_constants = yaml.load(fs.readFileSync('resources/yaml/notification_email_values.yaml', 'utf8'));
        } catch (e) {
            console.error(e)
        }
    }

    async send(fn){
        if (this.email_constants) return await fn();
        console.error("Unable to load email constants from file, email not sent");
    }

    async inactiveUserNotification(email, CCs, templateParams, messageVariables) {
        const message = replaceMessageVariables(this.email_constants.INACTIVE_USER_CONTENT, messageVariables);
        return await this.send(async () => {
            await this.emailService.sendNotification(
                this.email_constants.NOTIFICATION_SENDER,
                this.email_constants.INACTIVE_USER_SUBJECT,
                {message, templateParams},
                email,
                CCs
            );
        });
    }
}

module.exports = {
    NotifyUser
}