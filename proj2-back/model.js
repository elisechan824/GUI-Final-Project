/*
 * model back-end JavaScript code
 *
 * Author: Elise Chan (elisechan824)
 * Version: 2.0
 */

// Import mongoose library
const mongoose = require('mongoose');

// Create schema
const CS3744Schema = new mongoose.Schema({
    fileName: String,
    fileContent: {
        type: Object,
        properties: {
            title: String,
            data: {
                type: Array,
                items: {
                    type: Object
                }
            }
        }
    },
}, {versionKey: false  });


// Export schema
module.exports = mongoose.model('Proj2', CS3744Schema, 'Proj2');
