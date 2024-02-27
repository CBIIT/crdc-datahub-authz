const yaml = require('js-yaml');
const fs = require('fs');
const {replaceMessageVariables} = require("../utility/string-util");
const {createEmailTemplate} = require("../lib/create-email-template");

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

    async inactiveUserNotification(email, CCs, template_params, messageVariables, devTier) {
        const message = replaceMessageVariables(this.email_constants.INACTIVE_USER_CONTENT, messageVariables);
        const subject = this.email_constants.INACTIVE_USER_SUBJECT;
        return await this.send(async () => {
            await this.emailService.sendNotification(
                this.email_constants.NOTIFICATION_SENDER,
                isTierAdded(devTier) ? `${devTier} ${subject}` : subject,
                await createEmailTemplate("notification-template.html", {
                    message, ...template_params
                }),
                email,
                CCs
            );
        });
    }
}

const isTierAdded = (devTier) => {
    return devTier?.trim()?.length > 0
};

module.exports = {
    NotifyUser
}