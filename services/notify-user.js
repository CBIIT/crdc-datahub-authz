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
}

module.exports = {
    NotifyUser
}