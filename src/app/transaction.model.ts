export interface Transaction {
  id: string;
  text: string;
  category: string;
  amount: number;
  timeStamp: Date;
  userId: string;
}

export interface Target {
  $createdAt: Date;
  $id: string;
  $updatedAt: Date;
  expired: false;
  identifier: string;
  name: string;
  providerId: string;
  providerType: string;
  userId: string;
}

export interface User {
  $createdAt: Date;
  $id: string;
  $updatedAt: Date;
  accessedAt: Date;
  email: string;
  emailVerification: boolean;
  labels: string[];
  mfa: boolean;
  name: string;
  passwordUpdate: string;
  phone: string;
  phoneVerification: boolean;
  prefs: {};
  registration: Date;
  status: boolean;
  target: Target[];
  providerUid: string;
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
