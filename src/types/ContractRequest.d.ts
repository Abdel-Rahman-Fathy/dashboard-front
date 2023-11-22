export type ContractRequest = {
  id: number;
  code: number;
  period: number;
  date: number;
  card_image: null;
  details: string;
  type: ContractType;
  amount: number;
  contract_type_id: number;
  client_id: number;
  branch_id: number;
  management_id: number;
  status_id: number;
  employee_id: number;
  created_at: number;
  updated_at: number;
  deleted_at: null;
  dateEnd: number;
  end_date_period: number;
  client: null;
  employee: ContractEmployee;
  tasks: {};
  payments: {};
  management: null;
  branch: branch;
  levers: null;
};

type ContractType = {
  id: number;
  name: string;
  //   created_at: null;
  //   updated_at: null;
  //   deleted_at: null;
};

type ContractEmployee = {
  id: number;
  name: string;
  first_name: string;
  second_name: string;
  last_name: string;
  full_name: null;
  user_id: number;
  shift_id: number;
  email: string;
  phone: string;
  country_id: number;
  city_id: number;
  address: string;
  draft: number;
  has_overtime: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
};
type branch = {
  id: number;
  name: string;
  address: null;
  phone: string;
  email: string;
  type: string;
  //   manager_id: number;
  //   city_id: number;
  //   shift_id: number;
  //   is_clients: number;
  //   is_mangers: number;
  //   is_services: number;
  //   is_papers: number;
  //   is_projects: number;
  //   is_shifts: number;
  //   latitude: string;
  //   longitude: string;
  //   polygon: null;
  //   parent_id: null;
  //   active: number;
  //   share_client: number;
  //   share_service: number;
  //   share_paper: number;
  //   share_shift: number;
  //   share_manager: number;
  //   created_at: string;
  //   updated_at: string;
  //   deleted_at: null;
};
