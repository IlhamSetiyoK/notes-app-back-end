const {
    addNoteHandler,
    getAllNotesHandler,
    getNotesbyIdHandler,
    editNotesbyIdHandler,
    deleteNodebyIdHandler,
 } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/notes',
        handler: addNoteHandler,
    },
    {
        method: 'GET',
        path: '/notes',
        handler: getAllNotesHandler,
    },
    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getNotesbyIdHandler,
    },
    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: editNotesbyIdHandler,
    },
    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteNodebyIdHandler,
    },
];

module.exports = routes;
