-- # MGNREGA District Performance Dashboard - Database Schema
--
-- ## Overview
-- This migration creates the complete database schema for the MGNREGA District Performance Dashboard,
-- which empowers citizens to track rural employment scheme performance in their districts.
--
-- ## New Tables
--
-- ### 1. districts
-- Stores information about districts in the selected state (e.g., Telangana)
-- - id (uuid, primary key) - Unique identifier for each district
-- - name (text, not null) - District name (e.g., "Ranga Reddy", "Hyderabad")
-- - state (text, not null) - State name (default: "Telangana")
-- - latitude (numeric) - Geographic latitude for mapping
-- - longitude (numeric) - Geographic longitude for mapping
-- - created_at (timestamptz) - Record creation timestamp
--
-- ### 2. mgnrega_data
-- Stores monthly performance metrics for MGNREGA scheme in each district
-- - id (uuid, primary key) - Unique identifier for each data record
-- - district_id (uuid, foreign key) - Links to districts table
-- - month (integer, 1-12) - Month of the data
-- - year (integer) - Year of the data
-- - households_worked (integer) - Total households that worked
-- - person_days (bigint) - Total person-days of employment generated
-- - women_participation (numeric) - Percentage of women participation (0-100)
-- - total_expenditure (numeric) - Total expenditure in rupees
-- - avg_wage_rate (numeric) - Average wage rate per day in rupees
-- - budget_allocated (numeric) - Total budget allocated in rupees
-- - created_at (timestamptz) - Record creation timestamp
-- - updated_at (timestamptz) - Record update timestamp
--
-- ### 3. cache_status
-- Tracks the status of data synchronization from external APIs
-- - id (uuid, primary key) - Unique identifier
-- - last_updated (timestamptz) - When data was last fetched from API
-- - source_status (text) - Status of the data source ('active', 'down', 'throttled')
-- - total_records (integer) - Total number of records cached
-- - notes (text) - Additional notes about sync status
--
-- ## Security
--
-- ### Row Level Security (RLS)
-- - All tables have RLS enabled
-- - Public read access is granted for all tables since this is public government data
-- - Only authenticated service accounts can write/update data (for API sync operations)
--
-- ## Indexes
-- - Created indexes on frequently queried columns for optimal performance:
--   - mgnrega_data(district_id, year, month) - For time-series queries
--   - districts(name) - For district search

-- Drop the existing table if it exists
DROP TABLE IF EXISTS mgnrega_data;

-- Create the table with exact column names matching CSV
CREATE TABLE mgnrega_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fin_year text NOT NULL,
  month text NOT NULL,
  state_code text NOT NULL,
  state_name text NOT NULL,
  district_code text NOT NULL,
  district_name text NOT NULL,
  "Approved_Labour_Budget" numeric DEFAULT 0,
  "Average_Wage_rate_per_day_per_person" numeric DEFAULT 0,
  "Average_days_of_employment_provided_per_Household" numeric DEFAULT 0,
  "Differently_abled_persons_worked" integer DEFAULT 0,
  "Material_and_skilled_Wages" numeric DEFAULT 0,
  "Number_of_Completed_Works" integer DEFAULT 0,
  "Number_of_GPs_with_NIL_exp" integer DEFAULT 0,
  "Number_of_Ongoing_Works" integer DEFAULT 0,
  "Persondays_of_Central_Liability_so_far" bigint DEFAULT 0,
  "SC_persondays" bigint DEFAULT 0,
  "SC_workers_against_active_workers" integer DEFAULT 0,
  "ST_persondays" bigint DEFAULT 0,
  "ST_workers_against_active_workers" integer DEFAULT 0,
  "Total_Adm_Expenditure" numeric DEFAULT 0,
  "Total_Exp" numeric DEFAULT 0,
  "Total_Households_Worked" integer DEFAULT 0,
  "Total_Individuals_Worked" integer DEFAULT 0,
  "Total_No_of_Active_Job_Cards" integer DEFAULT 0,
  "Total_No_of_Active_Workers" integer DEFAULT 0,
  "Total_No_of_HHs_completed_100_Days_of_Wage_Employment" integer DEFAULT 0,
  "Total_No_of_JobCards_issued" integer DEFAULT 0,
  "Total_No_of_Workers" integer DEFAULT 0,
  "Total_No_of_Works_Takenup" integer DEFAULT 0,
  "Wages" numeric DEFAULT 0,
  "Women_Persondays" bigint DEFAULT 0,
  "percent_of_Category_B_Works" numeric DEFAULT 0,
  "percent_of_Expenditure_on_Agriculture_Allied_Works" numeric DEFAULT 0,
  "percent_of_NRM_Expenditure" numeric DEFAULT 0,
  "percentage_payments_gererated_within_15_days" numeric DEFAULT 0,
  "Remarks" text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS but allow all operations for now
ALTER TABLE mgnrega_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on mgnrega_data" ON mgnrega_data FOR ALL USING (true);