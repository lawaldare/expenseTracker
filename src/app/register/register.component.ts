import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthService } from "../auth.service";
import {
  form,
  required,
  email,
  FormField,
  FormRoot,
  minLength,
} from "@angular/forms/signals";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Component({
  selector: "app-register",
  imports: [RouterModule, FormField, FormRoot],
  templateUrl: "./register.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  protected readonly registerModel = signal<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  protected readonly registerForm = form(
    this.registerModel,
    (s) => {
      required(s.firstName);
      required(s.lastName);
      required(s.email);
      email(s.email);
      required(s.password);
      minLength(s.password, 8);
    },
    {
      submission: {
        action: async (field) => {
          await this.authService.signUp(field().value());
        },
      },
    },
  );
}
