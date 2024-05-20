const express = require('express');
const connectDB = require('./db/connect');
const morgan = require('morgan');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');

require('dotenv').config();
require('express-async-errors');

// Create express app
const app = express();

// Middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Routes
app.get('/', (req, res) => {
  console.log(req.signedCookies);
  res.send('Hello!');
});

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);


// Error handling middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// Set listening port
const PORT = process.env.PORT || 5050;

// Function to start listening on port
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
