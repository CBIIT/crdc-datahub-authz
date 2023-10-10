require('dotenv').config();

let config = {
    //info variables
    version: process.env.VERSION,
    date: process.env.DATE,

    //Mongo DB
    mongo_db_user: process.env.MONGO_DB_USER,
    mongo_db_password: process.env.MONGO_DB_PASSWORD,
    mongo_db_host: process.env.MONGO_DB_HOST,
    mongo_db_port: process.env.MONGO_DB_PORT,
    official_email: process.env.OFFICIAL_EMAIL || 'CRDCHelpDesk@nih.gov',
    // Email settings
    email_transport: getTransportConfig(),
    emails_enabled: process.env.EMAILS_ENABLED ? process.env.EMAILS_ENABLED.toLowerCase() === 'true' : true,
    //session
    session_secret: process.env.SESSION_SECRET,
    session_timeout: parseInt(process.env.SESSION_TIMEOUT_SECONDS) * 1000 || 30 * 60 * 1000,

    // Token
    token_secret: process.env.SESSION_SECRET,
    tokenTimeout: parseInt(process.env.TOKEN_TIMEOUT)*1000 || 60*24*60*60*1000
};
config.mongo_db_connection_string = `mongodb://${config.mongo_db_user}:${config.mongo_db_password}@${config.mongo_db_host}:${process.env.MONGO_DB_PORT}`;

function getTransportConfig() {
    return {
        host: process.env.EMAIL_SMTP_HOST,
        port: process.env.EMAIL_SMTP_PORT,
        secure: false,
        // Optional AWS Email Identity
        ...(process.env.EMAIL_USER && {
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER, // generated ethereal user
                    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
                }
            }
        )
    };
}

module.exports = config;
