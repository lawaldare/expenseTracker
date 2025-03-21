import { inject, Injectable, signal } from "@angular/core";
import { ID, Models } from "appwrite";
import { account, database } from "src/appwriteConfig";
import { User, UserRegister } from "./transaction.model";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { HotToastService } from "@ngxpert/hot-toast";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user = signal<User>({} as any);
  public publicUser = this.user.asReadonly();
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  constructor() {
    if (sessionStorage["x-user"]) {
      this.getAndSaveUserLocally();
    }
  }

  async signUp(newUser: UserRegister) {
    try {
      const user = await account.create(
        ID.unique(),
        newUser.email,
        newUser.password,
        `${newUser.firstName} ${newUser.lastName}`
      );
      await database.createDocument(
        environment.databaseId,
        environment.userCollectionId,
        user.$id,
        {
          id: user.$id,
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          email: newUser.email,
        }
      );
      // this.updateUser(user);
      this.setSession(user);
      this.getAndSaveUserLocally();
      this.toast.success(`Registration successful`);
      this.router.navigate(["tracker"]);
    } catch (error) {
      console.error(error);
      this.toast.error("Error occurred, please try again later");
    }
  }

  async signIn(userLogin: { email: string; password: string }) {
    try {
      const user = await account.createEmailPasswordSession(
        userLogin.email,
        userLogin.password
      );
      this.setSession(user);
      this.getAndSaveUserLocally();
      this.toast.success(`Welcome back 🎉`);
      this.router.navigate(["tracker"]);
    } catch (error) {
      console.error(error);
      this.toast.error("Invalid email or password!");
    }
  }

  async logoutUser() {
    try {
      await account.deleteSession("current");
      this.deleteSession();
    } catch (error) {
      console.error(error);
    }
  }

  public updateUser(user: any): void {
    this.user.set(user);
  }

  async getSessions(): Promise<Models.Session> {
    try {
      const sessionList = await account.listSessions();
      const sessions = sessionList.sessions[0];
      this.setSession(sessions);
      this.updateUser(sessions);
      this.router.navigate(["tracker"]);
      return sessions;
    } catch (error) {
      console.error(error);
    }
  }

  public setSession(data: any): void {
    sessionStorage.setItem("x-session", JSON.stringify(data));
  }

  public getSession(): Models.Session {
    return JSON.parse(sessionStorage.getItem("x-session"));
  }

  public deleteSession(): void {
    sessionStorage.removeItem("x-session");
    sessionStorage.removeItem("x-user");
  }

  public saveUserLocally(data: Models.User<Models.Preferences>): void {
    sessionStorage.setItem("x-user", JSON.stringify(data));
  }

  // public getUserLocally(): Models.User<Models.Preferences> {
  //   return JSON.parse(sessionStorage.getItem("x-user"));
  // }

  public async getAndSaveUserLocally() {
    try {
      const user = await account.get();
      this.updateUser(user);
      this.saveUserLocally(user);
    } catch (error) {
      console.error(error);
    }
  }

  public async getUserId(): Promise<string> {
    const user = await account.get();
    return user.targets[0]?.userId;
  }
}
