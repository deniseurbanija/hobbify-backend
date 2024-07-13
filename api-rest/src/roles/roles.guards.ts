import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Role } from './roles.enum';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      const hasRole = () =>
        requiredRoles.some((role) => {
          return user?.roles?.includes(role);
        });
      console.log(user.roles);
  
      const valid = user && user.roles && hasRole();
      if (!valid)
        throw new ForbiddenException('You do not have permission to access');
      return true;
    }
  }