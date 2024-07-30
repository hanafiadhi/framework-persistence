export interface IUserSchema {
  username: string | null;
  password: string;
  role: string[];
  applications: string[];
  is_logged_in: boolean;
  last_logged_in: Date;
  last_logged_out: Date;
  last_ip_address: string;
  last_logged_information?: {
    device_id?: string;
    device_brand?: string;
    device_model?: string;
    device_manufacture?: string;
    device_os?: string;
    device_os_version?: string;
  };
  verified: {
    verified_token: string;
    verified_at: string;
    verified_expired: number;
    verified_banned: number;
    verified_qty: number;
  };
  otp: {
    otp_token: string;
    otp_qty: number;
    otp_expired: number;
    otp_banned: number;
  };

  is_active?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
