const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(bodyParser.json());
// 使用cors
app.use(cors());

app.post('/update-note', (req, res) => {
  const filePath = path.join(__dirname, './note.json');
  fs.writeFile(filePath, JSON.stringify(req.body), (err) => {
    if (err) {
      res.status(500).send('Error writing to file');
    } else {
      res.send('File updated successfully');
    }
  });
});

// 在您的服务器代码中添加一个新端点来提供jsonData
app.get('/get-note', (req, res) => {
  const filePath = path.join(__dirname, './note.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
      return;
    }
    res.json(JSON.parse(data));
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

