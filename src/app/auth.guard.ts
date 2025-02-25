import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = JSON.parse(sessionStorage.getItem("x-user"));
  return user ? true : router.createUrlTree(["/"]);
};
