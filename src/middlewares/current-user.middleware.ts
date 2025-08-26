import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User;
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.userService.findOne(userId);

      req.currentUser = user;
    }
    next();
  }
}
