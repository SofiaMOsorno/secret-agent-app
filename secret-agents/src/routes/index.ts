import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth';
import { fileUpload } from '../middlewares/files';

const router = Router();

// Home
router.get('/', (req: Request, res: Response) => {
  res.render('index');
});

router.get('/register', (req: Request, res: Response) => {
    res.render('register');
  });

// Auth routes
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Falta un registro real
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).render('register', { error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    // TODO: Implement real authentication
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).render('login', { error: 'Login failed' });
  }
});

router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

router.get('/logout', (req: Request, res: Response) => {
  // TODO: Implement real logout
  res.redirect('/login');
});

router.get('/dashboard', (req: Request, res: Response) => {
  // TODO: Implement real dashboard data fetching
  const mockData = {
    onlineAgents: [],
    recentMessages: [],
    recentFiles: [],
    userRole: 'agent'
  };
  
  res.render('dashboard', mockData);
});

router.post('/upload', fileUpload.single('file'), (req: Request, res: Response) => {
  // TODO: Implement real file upload
  console.log(req.file);
  res.json({
    success: true,
    fileId: 'mock-file-id',
    filename: 'mock-file.txt'
  });
});

router.post('/message', (req: Request, res: Response) => {
  // TODO: Implement real messaging
  res.json({
    success: true,
    messageId: 'mock-message-id',
    timestamp: new Date()
  });
});

// Error 404 - Página no encontrada
router.use((req: Request, res: Response) => {
    res.status(404).render('error', {
      error: 'Página no encontrada',
      message: 'La página que estás buscando no existe.',
      code: 404
    });
  });

export default router;