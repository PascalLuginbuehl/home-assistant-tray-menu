import React from 'react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../utils/use-settings';

export default function CheckForUpdates() {
  const { systemAttributes: { computedOsTheme } } = useSettings();

  const { data: latestVersion } = useQuery({
    queryKey: ['latestVersion'],
    queryFn: async () => window.electronAPI.getLatestsVersion(),
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (latestVersion === null) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex h-[50px] w-full items-center bg-text-primary/[.04] p-2',
        {
          'rounded-lg': computedOsTheme === 'win11',
        },
      )}
    >
      <h2>
        New version available!
      </h2>
      <div className="grow" />
      <a
        href={latestVersion?.html_url}
        target="_blank"
        className={clsx(
          'bg-accent-main px-2 py-1 text-accent-mainContrastText hover:bg-accent-main/70',
          {
            'rounded-lg': computedOsTheme === 'win11',
          },
        )}
        rel="noreferrer"
      >
        Download
        {' '}
        {latestVersion?.tag_name}
      </a>
    </div>
  );
}
