import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { TransactionService } from "../transaction.service";
import { User } from "../transaction.model";
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

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.authService.signIn(form.value).then((response) => {
      this.router.navigate(["tracker"]);
    });
  }
}
