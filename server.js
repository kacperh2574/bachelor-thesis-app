const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// load environment variables
dotenv.config();

// connect to the database
const DB = process.env.DATABASE.replace('<PASSWD>', process.env.DATABASE_PASSWD);
mongoose.connect(DB, {
  useNewUrlParser: true
}).
then(() => console.log('Database connected...'));

// start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});