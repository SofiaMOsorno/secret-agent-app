import { User, IUser } from '../models/user';
import crypto from 'crypto';
import { generateCodename } from './codename';

interface AuthResponse {
  success: boolean;
  user?: IUser;
  error?: string;
}

export class AuthService {
  private static readonly ITERATIONS = 10000;
  private static readonly KEY_LENGTH = 64;
  private static readonly SALT_LENGTH = 16;
  private static readonly DIGEST = 'sha512';

  private async hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const generatedSalt = salt || crypto.randomBytes(AuthService.SALT_LENGTH).toString('hex');
    
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        generatedSalt,
        AuthService.ITERATIONS,
        AuthService.KEY_LENGTH,
        AuthService.DIGEST,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve({
            hash: derivedKey.toString('hex'),
            salt: generatedSalt
          });
        }
      );
    });
  }

  public async registerUser(email: string, password: string, isLeader: boolean = false): Promise<AuthResponse> {
    try {
      // Verificar si el email ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          success: false,
          error: 'Email already registered'
        };
      }

      // Generar hash y salt para la contraseña
      const { hash, salt } = await this.hashPassword(password);
      
      // Generar nombre en clave único
      const codename = await generateCodename();

      // Crear nuevo usuario
      const user = await User.create({
        email,
        password: hash,
        salt,
        codename,
        isLeader,
        isOnline: true,
        lastSeen: new Date()
      });

      return {
        success: true,
        user
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  public async authenticateUser(email: string, password: string): Promise<AuthResponse> {
    try {
      // Buscar usuario
      const user = await User.findOne({ email });
      if (!user || !user.password || !user.salt) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Verificar contraseña
      const { hash } = await this.hashPassword(password, user.salt);
      if (hash !== user.password) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Actualizar estado online
      await User.findByIdAndUpdate(user._id, {
        isOnline: true,
        lastSeen: new Date()
      });

      return {
        success: true,
        user
      };

    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  public async logoutUser(userId: string): Promise<AuthResponse> {
    try {
      // Actualizar estado offline
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      return {
        success: true
      };

    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Logout failed'
      };
    }
  }
}