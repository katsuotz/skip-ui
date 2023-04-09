export interface Profile {
  id?: number;
  nama: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string | Date;
  foto?: string;
}

export interface User {
  id?: number;
  username: string;
  role: Role;
  password?: string;
  profile?: Profile;
}

export interface UserResponse extends User, Profile {
  nis?: string;
  nip?: string;
  foto?: string;
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
  foto?: string;
}
