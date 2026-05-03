const result = require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./models');
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:5173'],
    optionsSuccessStatus: 200
}));
// Para reconocer el body desde un formulario HTML
app.use(bodyParser.urlencoded({ extended: false }));
// Para reconocer el body como JSON
app.use(bodyParser.json());

require("./routes")(app);
// Para habilitar la BD
db.sequelize.sync({
    //force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

app.listen(port, () => {
    console.log(`API listening on port ${port}`)
})
