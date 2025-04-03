export interface CustomerEntryType {
   status: number;
  message: string;
  data: CustomerEntryData[];
}

export interface CustomerEntryData {
  id: string;
  user_id: string;
  entry_at: string;
  entry_code: string;
  amount: number;
  status: string;
}

export interface CustomerType {
  id: number;
  customer: Customer;
  code: Code;
  created_at: Date;
}

export interface Code {
  id: number;
  code: string;
  prize_type: null;
  redeemed: boolean;
  created_at: Date;
}

export interface Customer {
  id: number;
  names: string;
  phone: string;
  network_operator: string;
  locale: string;
  province: CustomerProvince;
  district: District;
  created_at: Date;
}

export interface District {
  id: number;
  name: string;
  province: DistrictProvince;
}

export interface DistrictProvince {}

export interface CustomerProvince {
  id: number;
  name: string;
}


export interface WinnerType {
  id: string;
  customer: string;
  phone: string;
  prize_category: string;
  prize_type: string;
  prize_value: string;
  entry_code: string;
  claimed_date: Date;
  status: string;
}

 

export interface WinnerTypeData {
  id: number;
  prize_type: PrizeType;
  claimed_date: string;
  customer: Customer;
  code: string;
  created_at: string;
  status: string;
}

export interface Customer {
  id: number;
  names: string;
  phone: string;
  network_operator: string;
  locale: string;
  province: DistrictData;
  district: District;
  created_at: Date;
}

export interface DistrictData {
  id: number;
  name: string;
}

export interface PrizeType {
  id: number;
  name: string;
  value: number;
}



export interface Winner {
    id:     string;
    winner: string;
    code:   string[];
}
