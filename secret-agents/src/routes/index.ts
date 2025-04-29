import { Router } from 'express';
import { AuthService } from '../services/auth';
import { FileController } from '../controllers/file';
import { fileUpload } from '../middlewares/files';
import { auth } from '../middlewares/auth';

const router = Router();
const authService = new AuthService();
const fileController = new FileController();

// Public routes
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: req.session.error });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);

    if (!result.success || !result.user) {
      return res.render('login', { error: result.error });
    }

    req.session.userId = result.user.id;
    req.session.isAuthenticated = true;
    req.session.userRole = result.user.isLeader ? 'leader' : 'agent';

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Login failed' });
  }
});

router.get('/register', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, inviteCode } = req.body;
    const isLeader = inviteCode === process.env.LEADER_INVITE_CODE;

    const result = await authService.registerUser(email, password, isLeader);
    
    if (!result.success || !result.user) {
      return res.render('register', { error: result.error });
    }

    req.session.userId = result.user.id;
    req.session.isAuthenticated = true;
    req.session.userRole = result.user.isLeader ? 'leader' : 'agent';

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Registration failed' });
  }
});

// Protected routes
router.use(auth);

router.get('/dashboard', async (req, res) => {
  try {
    const files = await fileController.getUserFiles(req, res);
    res.render('dashboard', {
      files,
      userRole: req.session.userRole
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('error', { error: 'Failed to load dashboard' });
  }
});

router.post('/upload', fileUpload.single('file'), fileController.uploadFile);

router.get('/files', fileController.getUserFiles);

router.delete('/files/:fileId', fileController.deleteFile);

router.get('/logout', async (req, res) => {
  if (req.session.userId) {
    await authService.logoutUser(req.session.userId);
  }
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
    res.redirect('/login');
  });
});

export default router;