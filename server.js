const dotenv = require('dotenv');
const app = require('./app');

// load environment variables
dotenv.config();

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});