export type UserPreferences = {
  currency: string;
  dark_mode: boolean;
  animations_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_summaries: boolean;
  expense_reminders: boolean;
};

export const defaultPreferences: UserPreferences = {
  currency: "PHP",
  dark_mode: true,
  animations_enabled: true,
  email_notifications: true,
  push_notifications: false,
  weekly_summaries: true,
  expense_reminders: true,
};
