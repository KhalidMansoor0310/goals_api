const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000 || process.env
const UserRoute = require('./routes/UserRoute')
const cors = require('cors');

require('dotenv').config()
app.use(express.json());
app.use('/api/articles',require('./routes/ArticleRoute'))
app.use('/api/',UserRoute)
app.use(cors());

// db connection 
// mongoose.connect(process.env.db_connect);
mongoose.connect(process.env.db_connect, {

  useNewUrlParser: "true",
  useUnifiedTopology: "true"

},()=>{
    console.log("Connection successfull")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})