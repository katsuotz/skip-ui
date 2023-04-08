export interface Profile {
  id?: number;
  nama: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string | Date;
}

export interface User {
  id?: number;
  username: string;
  role: Role;
  password?: string;
  profile?: Profile;
}

export type Role =
  | ""
  | "admin"
  | "staff-ict"
  | "siswa"
  | "guru";

export interface LoginLog {
  username: string;
  nama: string;
  role: Role;
  action: string;
  user_agent: string;
  location: string;
  created_at: string;
}
