/**
 * Logs a message to the console with specified color formatting and writes it to a log file.
 * 
 * @module log
 */

const fs = require('fs');

/**
 * Logs a message to a file.
 *
 * @param {string} message - The message to log.
 */
const logFileName = `./logs/logs_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;

function logToFile(message) {
    const logStream = fs.createWriteStream(logFileName, { flags: 'a' });
    logStream.write(`${message}\n`);
    logStream.end();
}

module.exports = {
        /**
         * Logs a message in white color to the console and writes it to a log file.
         *
         * @param {string} message - The message to log.
         */
        white: (message) => {
                console.log(`${message}`)
                logToFile(message)
        },
        /**
         * Logs a message in red color to the console and writes it to a log file.
         *
         * @param {string} message - The message to log.
         */
        red: (message) => {
                console.log(`\x1b[31m ${message} \x1b[0m`)
                logToFile(message)
        },
        /**
         * Logs a message with a red background to the console and writes it to a log file.
         *
         * @param {string} message - The message to log.
         */
        redBg: (message) => {
                console.log(`\x1b[41m ${message} \x1b[0m`)
                logToFile(message)
        },
        /**
         * Logs a message in green color to the console and writes it to a log file.
         *
         * @param {string} message - The message to log.
         */
        green: (message) => {
                console.log(`\x1b[32m ${message} \x1b[0m`)
                logToFile(message)
        },
        /**
         * Logs a message with a green background to the console and writes it to a log file.
         *
         * @param {string} message - The message to log.
         */
        greenBg: (message) => {
                console.log(`\x1b[42m ${message} \x1b[0m`)
                logToFile(message)
        },
        /**
         * Logs a message in yellow color to the console and writes it to a log file.
         *
         * @param {string} message - The message to log.
         */
        yellow: (message) => {
                console.log(`\x1b[33m ${message} \x1b[0m`)
                logToFile(message)
        },
        /**
         * Logs a message with a yellow background to the console and writes it to a log file.
         *
         * @param {string} message - The message to log.
         */
        yellowBg: (message) => {
                console.log(`\x1b[43m ${message} \x1b[0m`)
                logToFile(message)
        },
        /**
         * Logs a message in blue color to the console and writes it to a log file.
         *
         * @param {string} message - The message to log.
         */
        blue: (message) => {
                console.log(`\x1b[34m ${message} \x1b[0m`)
                logToFile(message)
        },
}
        