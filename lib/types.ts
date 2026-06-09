export type Confidence = "high" | "medium" | "low";

export interface Contract {
  award_id_piid: string;
  recipient_name: string | null;
  transaction_description: string | null;
  action_type: string | null;
  action_type_description: string | null;
  award_type: string | null;
  product_or_service_code: string | null;
  product_or_service_code_description: string | null;
  naics_code: string | null;
  naics_description: string | null;
  federal_action_obligation: string | number | null;
  potential_total_value_of_award: string | number | null;
  action_date: string | null;
  period_of_performance_start_date: string | null;
  period_of_performance_current_end_date: string | null;
  primary_place_of_performance_city_name: string | null;
  primary_place_of_performance_state_code: string | null;
  primary_place_of_performance_state_name: string | null;
  primary_place_of_performance_zip_4: string | null;
  awarding_office_name: string | null;
  is_surveillance: boolean | null;
  surveillance_confidence: Confidence | null;
}

export interface ContractsResponse {
  data: Contract[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StatsResponse {
  total_procurement_actions: number | null;
  total_obligated_all: number | null;
  surveillance: {
    total_count: number;
    total_obligated: number;
    breakdown: {
      high: { count: number; obligated: number };
      medium: { count: number; obligated: number };
      low: { count: number; obligated: number };
    };
  };
  states_with_surveillance: number;
}
