const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationsPayLoadSchema } = require('./schema');

const CollaborationsValidator = {
    validateCollaborationPayLoad: (payload) => {
        const validationResult = CollaborationsPayLoadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = CollaborationsValidator;
