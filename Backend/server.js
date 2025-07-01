import express from "express"
import authRoutes from './routes/authRoutes.js'
import trendingRoutes from './routes/trendingSongRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
const app = express()
const PORT = 5200;
app.use(express.json())
app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
app.use('/auth', authRoutes)
authRoutes.use('/login/trending', trendingRoutes)
authRoutes.use('/search', searchRoutes)
app.listen(PORT, console.log(`Successful connection to ${PORT}`))
