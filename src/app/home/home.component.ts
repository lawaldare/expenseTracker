import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthService } from "../auth.service";
import {
  email,
  form,
  FormField,
  FormRoot,
  required,
} from "@angular/forms/signals";

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: "app-home",
  imports: [RouterModule, FormField, FormRoot],
  templateUrl: "./home.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
  private readonly authService = inject(AuthService);

  protected readonly loginModel = signal<LoginData>({
    email: "",
    password: "",
  });
  protected readonly loginForm = form(this.loginModel, (s) => {
    required(s.email);
    email(s.email);
    required(s.password);
  });

  async ngOnInit(): Promise<void> {
    await this.authService.getSessions();
  }

  async onSubmit() {
    this.authService.signIn(this.loginModel());
  }
}
