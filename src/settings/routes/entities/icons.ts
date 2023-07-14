import * as icons from '@mdi/js';
import meta from '@mdi/svg/meta.json';

const camelize = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase());

const metaValues = [...Object.values(meta)];

export const getIconsPath = (iconName: string): string | null => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const icon = icons[camelize(`mdi-${iconName}`)];

  if (!icon) {
    return null;
  }

  return icon;
};

// Icons can be found here: https://pictogrammers.com/library/mdi/
export default metaValues.map((value) => ({ ...value, path: getIconsPath(value.name) }));
