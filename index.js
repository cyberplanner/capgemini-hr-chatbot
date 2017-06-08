/*-----------------------------------------------------------------------------
sample setup to get this started

# RUN THE BOT LOCALLY:

    * Install Bot Framework Emulator
    * Install ngrok found at https://ngrok.com/.
    * Run the bot from the command line using "index app.js".
    * In Emulator enter "http://localhost:3978/api/messages" as endpoint and connect.
    * say "Hello"

-----------------------------------------------------------------------------*/

const config = require('config');
require('dotenv').config();
const botComponents = require('./custom_modules/module_botComponents');
const restify = require('restify');
var dbcon = require('./custom_modules/module_dbConnection');
const swgr = require('./public/app');

const builder = botComponents.getBuilder();
const bot = botComponents.getBot();
var db = dbcon.getConnection();

//=========================================================
//swagger setup
//=========================================================
const swgr = require('./public/app');


//=========================================================
//Bots Dialogs
//=========================================================
// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
const recognizer = botComponents.getRecognizer();
const dialog = botComponents.getDialog();
bot.dialog('/', dialog);

//Get intents configuration
const intentsConfig = config.get("Bot.intents");


//HolidaysLeft intent. Luis based.
dialog.matches(intentsConfig.holidaysleft.name, [
    (session, args, next) => {
        session.send(intentsConfig.holidaysleft.messages.default);
    }
]);

//HolidaysEntitlement intent. Luis based.
dialog.matches(intentsConfig.holidaysentitlement.name, [
    (session, args, next) => {
        session.send(intentsConfig.holidaysentitlement.messages.default);
    }
]);

//welcome intent. Luis based.
dialog.matches(intentsConfig.welcome.name, [
    (session, args, next) => {
        session.send(intentsConfig.welcome.messages.default);
    }
]);

//default response if users command is unknown.
dialog.onDefault(builder.DialogAction.send(intentsConfig.none.messages.default));

//=========================================================
// Setup Server
//=========================================================

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

server.post('/api/messages', botComponents.getConnector().listen());
