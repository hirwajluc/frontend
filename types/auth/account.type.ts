export interface AccountType {
  status: number;
  message: string;
  accessToken: string;
  data: AccountData;
}

export interface AccountData {
  id: number;
  firstname: string;
  lastname: string;
  avatar_url: string;
  can_add_codes: boolean;
  can_add_user: boolean;
  can_trigger_draw: boolean;
  can_view_logs: boolean;
  email: string;
  phone: string;
  status: string;
  email_verified: boolean;
  force_change_password: boolean;
  department: Department;
}

export interface Department {
  id: number;
  title: string;
}

export interface Address {
  country: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
}

export interface TransactionData {
  id: string;
  prize_id: number;
  customer_id: string;
  trx_id: string;
  ref_no: string;
  transaction_type: string;
  amount: number;
  phone: string;
  mno: string;
  initiated_by: string;
  status: string;
  error_message: string;
  created_at: string;
  updated_at: string;
}

export interface PrizeTypeData {
  id: number;
  name: string;
  prize_category: Category;
  value: number;
  elligibility: string;
  status: string;
  expiry_date: Date;
  period: string;
  distribution: string;
  trigger_by_system: string;
  messages: Message[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Message {
  lang: string;
  message: string;
}

export interface PrizeCategoryData {
  id: number;
  status: string;
  name: string;
  created_at: string;
}


export interface CodeOverviewType {
  totalCode: string;
  usedCode: string;
  remainCode: string;
}


export interface PrizeOverviewType {
  total_prize: number;
  prize_count: number;
  total_elligibility: number;
  prize_type: string;
}


 export interface CustomerType {
   customer: Customer;
   code: Code;
   prize: Prize;
   created_at: string;
 }

 export interface Code {
   id: number;
   code: string;
   prize_type: null;
   created_at: string;
 }

 export interface Customer {
   id: number;
   names: string;
   phone: string;
   created_at: Date;
   network_operator: string;
   province: District;
   district: District;
   locale: string;
 }

 export interface District {
   id: number;
   name: string;
 }

 export interface Prize {
   id: string;
   value: string;
   created_at: string;
 }
