import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from './routes/authRoutes.js'
import trendingRoutes from './routes/trendingSongRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import savedSongsRoutes from './routes/savedSongRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
const app = express()
const PORT = 5200;
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
app.use('/auth', authRoutes)
authRoutes.use('/login/trending', trendingRoutes)
authRoutes.use('/search', searchRoutes)
authRoutes.use('/favorites', savedSongsRoutes)
authRoutes.use('/admin', adminRoutes)
app.listen(PORT, console.log(`Successful connection to ${PORT}`))
