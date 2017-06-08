// Module Imports
const RestifyRouter = require('restify-routing');
const validator = require( 'restify-json-schema-validation-middleware' )();

let db;

// Setup Router
let knowledgeRouter = new RestifyRouter();

/*
    Import Schemas
*/
const createKnowledgeSchema = require('./schemas/createKnowledge.json');

knowledgeRouter.post('/:id', 
    validator.body( createKnowledgeSchema ),
    (req, res) => {
        db.insert(req.body, Object.assign({
            _id: req.params.id
        }))
        .then(() => {
            res.json(200, {message: "Successfully saved knowledge."});
        })
        .catch(error => {
            console.error(error);  
            res.json(500, {error: error.message});
        });
    });

module.exports = (database) => {
    db = database;
    return knowledgeRouter
};