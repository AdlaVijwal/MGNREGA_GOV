export interface District {
  id: string;
  name: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface MgnregaData {
  id: string;
  fin_year: string;
  month: string;
  state_code: string;
  state_name: string;
  district_code: string;
  district_name: string;
  Approved_Labour_Budget: number;
  Average_Wage_rate_per_day_per_person: number;
  Average_days_of_employment_provided_per_Household: number;
  Differently_abled_persons_worked: number;
  Material_and_skilled_Wages: number;
  Number_of_Completed_Works: number;
  Number_of_GPs_with_NIL_exp: number;
  Number_of_Ongoing_Works: number;
  Persondays_of_Central_Liability_so_far: number;
  SC_persondays: number;
  SC_workers_against_active_workers: number;
  ST_persondays: number;
  ST_workers_against_active_workers: number;
  Total_Adm_Expenditure: number;
  Total_Exp: number;
  Total_Households_Worked: number;
  Total_Individuals_Worked: number;
  Total_No_of_Active_Job_Cards: number;
  Total_No_of_Active_Workers: number;
  Total_No_of_HHs_completed_100_Days_of_Wage_Employment: number;
  Total_No_of_JobCards_issued: number;
  Total_No_of_Workers: number;
  Total_No_of_Works_Takenup: number;
  Wages: number;
  Women_Persondays: number;
  percent_of_Category_B_Works: number;
  percent_of_Expenditure_on_Agriculture_Allied_Works: number;
  percent_of_NRM_Expenditure: number;
  percentage_payments_gererated_within_15_days: number;
  Remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface CacheStatus {
  id: string;
  last_updated: string;
  source_status: string;
  total_records: number;
  notes: string | null;
}

export interface Database {
  public: {
    Tables: {
      districts: {
        Row: District;
        Insert: Omit<District, 'id' | 'created_at'>;
        Update: Partial<Omit<District, 'id' | 'created_at'>>;
      };
      mgnrega_data: {
        Row: MgnregaData;
        Insert: Omit<MgnregaData, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MgnregaData, 'id' | 'created_at' | 'updated_at'>>;
      };
      cache_status: {
        Row: CacheStatus;
        Insert: Omit<CacheStatus, 'id'>;
        Update: Partial<Omit<CacheStatus, 'id'>>;
      };
    };
  };
}
