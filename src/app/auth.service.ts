import { Injectable, signal } from "@angular/core";
import { ID } from "appwrite";
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
      const user = JSON.parse(localStorage.getItem("User"));
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
      console.log(user);
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

  public updateUser(user: User): void {
    this.user.set(user);
  }
}
