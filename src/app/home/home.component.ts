import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../auth.service";
import { HotToastService } from "@ngxpert/hot-toast";

@Component({
  selector: "app-home",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toast = inject(HotToastService);

  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.authService.getSessions();
  }

  async onSubmit(form: NgForm) {
    this.authService.signIn(form.value);
  }
}
