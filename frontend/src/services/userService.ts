import { apiRequest } from './api';

export interface UserSettings {
  id: number;
  darkMode: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsData {
  darkMode: boolean;
}

export const userService = {
  async getSettings(): Promise<UserSettings> {
    const response = await apiRequest('/user/user-settings');
    return response.data;
  },

  async updateSettings(data: UpdateSettingsData): Promise<UserSettings> {
    const response = await apiRequest('/user/user-settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },
};
