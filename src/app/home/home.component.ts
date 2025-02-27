import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-home",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  async onSubmit(form: NgForm) {
    // const sessions = await this.authService.getSessions();
    // if (sessions.length) {
    //   await this.authService.logoutUser();
    // }
    this.authService.signIn(form.value).then((response) => {
      this.router.navigate(["tracker"]);
    });
  }
}
