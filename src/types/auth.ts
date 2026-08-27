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
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  secondary_bank_name?: string;
  secondary_account_number?: string;
  secondary_account_holder?: string;
  default_shipping_cost: number;
}
