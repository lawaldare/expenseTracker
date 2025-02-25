import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { authGuard } from "./auth.guard";

export const routes: Routes = [
  {
    path: "tracker",
    loadComponent: () =>
      import("./tracker/tracker.component").then((x) => x.TrackerComponent),
    canActivate: [authGuard],
  },
  {
    path: "register",
    loadComponent: () =>
      import("./register/register.component").then((x) => x.RegisterComponent),
  },
  {
    path: "",
    component: HomeComponent,
  },
];
