// Login & Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  name: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface Partner {
  partner_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  status: string;
  joined_date: string;
}

export interface SubscriptionPlan {
  plan_id: string;
  plan_name: string;
  price: string;
  branch_limit: number;
  device_limit: number;
  description: string;
}

export interface License {
  license_id: string;
  partner_id: string;
  activation_code: string;
  device_id: string | null;
  device_name: string | null;
  license_status: string;
}

export interface PartnerSubscription {
  subscription_id: string;
  partner_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  payment_status: string;
  subscription_plan?: SubscriptionPlan;
}
