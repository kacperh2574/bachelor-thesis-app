const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('❗ Uncaught exception - shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

// load environment variables
dotenv.config();

// connect with database
const DB = process.env.DATABASE.replace(
    '<PASSWD>',
    process.env.DATABASE_PASSWD
);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then(() => console.log('👍 Database connected...'));

// start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`👍 Server is running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('❗ Unhandled rejection - shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
