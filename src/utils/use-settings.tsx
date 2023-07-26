import React, {
  createContext, useCallback, useContext, useMemo,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress } from '@mui/material';
import APIUrlStateEnum from '../types/api-state-enum';
import { ISettings } from '../store';

interface ISettingsContext {
  settings: ISettings
  apiURLState: APIUrlStateEnum | undefined
  refetchAPIUrlState: () => void
  saveSettings: (settings: Partial<ISettings>) => Promise<void>
  systemAttributes: {
    computedOsTheme: 'win10' | 'win11'
    accentColor: string
  }
}

const SettingsContext = createContext<ISettingsContext | null>(null);

export function useSettings(): ISettingsContext {
  const context = useContext(SettingsContext);

  if (context === null) {
    throw Error('Context has not been Provided!');
  }

  return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: systemAttributes } = useQuery({
    queryKey: ['system-attributes'],
    queryFn: async () => window.electronAPI.getSystemAttributes(),
  });

  const { data: settings, refetch: refetchSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => window.electronAPI.store.getSettings(),
    retry: false,
    cacheTime: 0,
  });

  const { data: apiURLState, refetch: refetchAPIUrlState } = useQuery({
    queryKey: ['connection', settings?.hassApiUrl, settings?.longLivedAccessToken],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => window.electronAPI.checkAPIUrl(settings!.hassApiUrl, settings!.longLivedAccessToken),
    enabled: !!settings,
    retry: false,
    cacheTime: 0,
  });

  const saveSettings = useCallback(async (newSettings: Partial<ISettings>) => {
    if (!settings) {
      return;
    }

    await window.electronAPI.store.setSettings({ ...settings, ...newSettings });
    await refetchSettings();
  }, [settings, refetchSettings]);

  const value = useMemo<ISettingsContext | null>(() => {
    if (!settings || !systemAttributes) {
      return null;
    }

    return {
      apiURLState,
      settings,
      refetchAPIUrlState,
      saveSettings,
      systemAttributes: {
        computedOsTheme: settings.development.osTheme === 'system' ? systemAttributes.osTheme : settings.development.osTheme,
        accentColor: systemAttributes.accentColor,
      },
    };
  }, [apiURLState, settings, refetchAPIUrlState, saveSettings, systemAttributes]);

  if (value === null) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
