export interface IResponse {
  status: number;
  message: string;
  data?: IAccount;
}

export interface IAccount {
  username: string;
  dateOfBirth: Date;
  email: string;
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
