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
  confirmToken?: string;
  verifiedAt?: string;
  is_active?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
