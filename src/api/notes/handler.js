/* eslint-disable no-underscore-dangle */
/* eslint-disable space-before-blocks */
// // eslint-disable-next-line import/no-extraneous-dependencies
// const { nanoid } = require('nanoid');
// const notes = require('../../services/inMemory/NotesService.js');

const ClientError = require('../../exceptions/ClientError');

// const addNoteHandler = (request, h) => {
//     const { title, tags, body } = request.payload;

//     // const id = nanoid(16);

//     const createdAt = new Date().toISOString();

//     const updatedAt = createdAt;

//     const newNote = {
//         title, tags, body, id, createdAt, updatedAt,
//     };

//     notes.push(newNote);

//     const isSuccess = notes.filter((note) => note.id === id).length > 0;

//     if (isSuccess) {
//         const response = h.response({
//             status: 'success',
//             message: 'Catatan berhasil ditambahkan',
//             data: {
//                 noteId: id,
//             },
//         });
//         response.code(201);
//         return response;
//     }

//     const response = h.response({
//         status: 'fail',
//         message: 'Catatan gagal ditambahkan',
//     });
//     response.code(500);
//     return response;
// };

// const getAllNotesHandler = () => ({
//     status: 'success',
//     data: {
//         notes,
//     },
// });

// const getNotesbyIdHandler = (request, h) => {
//     const { id } = request.params;

//     const note = notes.filter((n) => n.id === id)[0];

//     if (note !== undefined) {
//         return {
//             status: 'success',
//             data: {
//                 note,
//             },
//         };
//     }

//     const response = h.response({
//         status: 'fail',
//         message: 'Catatan tidak ditemukan',
//     });

//     response.code(404);
//     return response;
// };

// const editNotesbyIdHandler = (request, h) => {
//     const { id } = request.params;
//     const { title, tags, body } = request.payload;
//     const updatedAt = new Date().toISOString();

//     const index = notes.findIndex((note) => note.id === id);

//     if (index !== -1) {
//         notes[index] = {
//             ...notes[index],
//             title,
//             tags,
//             body,
//             updatedAt,
//         };

//         const response = h.response({
//             status: 'success',
//             message: 'Catatan berhasil diperbarui',
//         });

//         response.code(200);
//         return response;
//     }

//     const response = h.response({
//         status: 'fail',
//         message: 'Gagal memperbarui catatan. Id tidak ditemukan',
//     });

//     response.code(404);
//     return response;
// };

// const deleteNodebyIdHandler = (request, h) => {
//     const { id } = request.params;

//     const index = notes.findIndex((note) => note.id === id);

//     if (index !== -1) {
//         notes.splice(index, 1);
//         const response = h.response({
//             status: 'success',
//             message: 'Catatan berhasil dihapus',
//         });

//         response.code(200);
//         return response;
//     }

//     const response = h.response({
//         status: 'fail',
//         message: 'Catatan gagal dihapus. Id tidak ditemukan',
//     });

//     response.code(404);
//     return response;
// };

// module.exports = {
//     addNoteHandler,
//     getAllNotesHandler,
//     getNotesbyIdHandler,
//     editNotesbyIdHandler,
//     deleteNodebyIdHandler,
// };
class NoteHandler {
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }

    async postNoteHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);
            const { title = 'untitled', body, tags } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            const noteId = await this._service.addNote({
                title,
                body,
                tags,
                owner: credentialId,
            });

            const response = h.response({
                status: 'success',
                message: 'Catatan berhasil ditambahkan',
                data: {
                    noteId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getNotesHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const notes = await this._service.getNotes(credentialId);
        return {
            status: 'success',
            data: {
                notes,
            },
        };
    }

    async getNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyNoteAccess(id, credentialId);
            const note = await this._service.getNoteById(id);

            return {
                status: 'success',
                data: {
                    note,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async putNoteByIdHandler(request, h) {
        try {
            this._validator.validateNotePayload(request.payload);
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyNoteAccess(id, credentialId);
            await this._service.editNoteById(id, request.payload);

            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };
        } catch (error) {
            if (error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteNoteByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._service.verifyNoteOwner(id, credentialId);

            await this._service.deleteNoteById(id);

            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = NoteHandler;
