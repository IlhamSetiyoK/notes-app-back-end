const Joi = require('joi');

const CollaborationsPayLoadSchema = Joi.object({
    noteId: Joi.string().required(),
    userId: Joi.string().required(),
});

module.exports = { CollaborationsPayLoadSchema };
