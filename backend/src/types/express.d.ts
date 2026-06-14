import { AuthUserData } from '@/decorators/auth-user.decorator'

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserData
    }
  }
}
