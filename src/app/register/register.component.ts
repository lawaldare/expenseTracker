import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-register",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  onSubmit(form: NgForm) {
    this.authService.signUp(form.value);
  }
}
