const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api', (req, res) => {
    res.send('Hello from Backend!');
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});