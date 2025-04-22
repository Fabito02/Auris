import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../models/User';
import connection from '../db';

const jwtSecret = process.env.JWT_SECRET || 'secret_fallback_development';

passport.use(new LocalStrategy(
  { usernameField: 'Email', passwordField: 'Senha' },
  async (email, password, done) => {
    try {
      const [rows] = await connection.promise().query<IUser[]>(
        'SELECT User_ID, Email, Senha FROM Users WHERE Email = ?',
        [email]
      );

      const user = rows[0] as IUser;
      
      if (!user) return done(null, false, { message: 'Usuário não encontrado' });
      if (!await bcrypt.compare(password, user.Senha!)) {
        return done(null, false, { message: 'Senha incorreta' });
      }

      delete user.Senha;
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
));

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
  },
  async (payload: IUser, done) => {
    try {
      const [rows] = await connection.promise().query<IUser[]>(
        'SELECT User_ID, Email FROM Users WHERE User_ID = ?',
        [payload.User_ID]
      );

      const user = rows[0] as IUser;
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error as Error);
    }
  }
));

export const generateToken = (user: IUser) => {
  return jwt.sign(
    { 
      User_ID: user.User_ID,
      Email: user.Email,
      Role: user.Role,
    },
    jwtSecret,
    { expiresIn: '1d' }
  );
};