const express = require('express');

const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.status(200).json({message: 'Homepage', app: 'Escape room booking'});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});