import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import { join } from 'path';
import { config } from 'dotenv';
import routes from './routes';

// Load environment variables
config();

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// View engine setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
const publicPath = join(__dirname, '..', 'public');
app.use('/assets', express.static(publicPath));

// Routes
app.use(routes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).render('error', { error: 'Something went wrong!' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});