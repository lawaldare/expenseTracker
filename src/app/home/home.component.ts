import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-home",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);

  async ngOnInit(): Promise<void> {
    await this.authService.getSessions();
  }

  async onSubmit(form: NgForm) {
    this.authService.signIn(form.value);
  }
}
