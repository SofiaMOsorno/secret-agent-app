import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth';

const router = Router();
const authService = new AuthService();

// Login
router.get('/login', (req: Request, res: Response) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  // Ahora error está tipado correctamente en la sesión
  res.render('login', { error: req.session.error || null });
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.authenticateUser(email, password);
    
    if (!result.success || !result.user) {
      // Guardamos el error en la sesión
      req.session.error = result.error;
      return res.render('login', { error: result.error });
    }

    // El id ahora está disponible gracias a extender Document
    req.session.userId = result.user.id; // Mongoose provee .id como getter
    req.session.isAuthenticated = true;
    req.session.userRole = result.user.isLeader ? 'leader' : 'agent';
    
    // Limpiamos cualquier error previo
    delete req.session.error;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.session.error = 'Login failed';
    res.render('login', { error: 'Login failed' });
  }
});

// Register
router.get('/register', (req: Request, res: Response) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('register', { error: req.session.error || null });
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, inviteCode } = req.body;
    
    // TODO: Implementar validación de código de invitación
    const isLeader = inviteCode === process.env.LEADER_INVITE_CODE;

    const result = await authService.registerUser(email, password, isLeader);
    
    if (!result.success || !result.user) {
      req.session.error = result.error;
      return res.render('register', { error: result.error });
    }

    req.session.userId = result.user.id;
    req.session.isAuthenticated = true;
    req.session.userRole = result.user.isLeader ? 'leader' : 'agent';
    
    delete req.session.error;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    req.session.error = 'Registration failed';
    res.render('register', { error: 'Registration failed' });
  }
});

// Logout
router.get('/logout', async (req: Request, res: Response) => {
  try {
    if (req.session.userId) {
      await authService.logoutUser(req.session.userId);
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.redirect('/login');
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.redirect('/dashboard');
  }
});

export default router;