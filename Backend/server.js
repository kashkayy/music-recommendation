import express from "express"
const app = express()
const PORT = process.env.PORT || 5500;
app.use(express.json())
app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
app.listen(PORT, console.log(`Successful connection to ${PORT}`))
 