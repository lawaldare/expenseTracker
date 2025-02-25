import { Client, Account, Databases } from "appwrite";
import { environment } from "./environments/environment";

const client = new Client();

client.setEndpoint(environment.API).setProject(environment.projectId);

export const account = new Account(client);
export const database = new Databases(client);

export default client;
