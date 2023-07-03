import { useQuery } from '@tanstack/react-query';
import { ISettings } from '../store';

export default function useSettings() {
  const { data: settings, isSuccess, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => window.electronAPI.store.getSettings(),
  });

  const saveSettings = async (newSettings: Partial<ISettings>) => {
    if (!isSuccess) {
      return;
    }
    await window.electronAPI.store.setSettings({ ...settings, ...newSettings });
  };

  return {
    settings, isSuccess, refetch, saveSettings,
  };
}
