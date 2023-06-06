// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const NotePayLoadSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
});

module.exports = { NotePayLoadSchema };
