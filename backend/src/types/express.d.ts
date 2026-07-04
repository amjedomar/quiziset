import { AuthUserData } from '@/decorators/auth-user'

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserData
    }
  }
}
