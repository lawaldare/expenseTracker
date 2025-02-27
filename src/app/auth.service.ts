import { Injectable, signal } from "@angular/core";
import { ID, Models } from "appwrite";
import { account, database } from "src/appwriteConfig";
import { User, UserRegister } from "./transaction.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user = signal<User>({} as any);
  public publicUser = this.user.asReadonly();

  constructor() {
    if (sessionStorage["x-user"]) {
      const user = JSON.parse(sessionStorage.getItem("x-user"));
      this.updateUser(user);
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
      console.log(user);
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
      this.updateUser(user);
      sessionStorage.setItem("x-user", JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  }

  async signIn(userLogin: { email: string; password: string }) {
    try {
      const user = await account.createEmailPasswordSession(
        userLogin.email,
        userLogin.password
      );
      this.updateUser(user);
      sessionStorage.setItem("x-user", JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  }

  async logoutUser() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error(error);
    }
  }

  public updateUser(user: any): void {
    this.user.set(user);
  }

  async getSessions(): Promise<Models.Session[]> {
    try {
      const sessions = (await account.listSessions()).sessions;
      return sessions;
    } catch (error) {
      console.error(error);
    }
  }
}
