
//test dotenv env import

const dotenv = require('dotenv');
dotenv.config();

const PORT = +process.env.PORT || 8080;

module.exports = (req, res) => {

return res.status(200).send(`running on port: ${PORT}`)

}