import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as Array<string>;
  const user = authService.getCurrentUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Check if the user has any of the required roles
  const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));

  if (!hasRequiredRole) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
