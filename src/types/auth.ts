export interface Admin {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  id?: number;
  store_name: string;
  store_tagline?: string;
  tagline?: string;
  logo_url?: string;
  logo?: string;
  whatsapp: string;
  email: string;
  address: string;
}


export interface UpdateProfileAdmin {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}
