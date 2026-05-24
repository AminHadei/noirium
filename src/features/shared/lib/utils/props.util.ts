import { config, type ConfigType } from '@/config';

export const parseWebcProp = <T>(prop: string | T): T => {
  const localProp = (typeof prop === 'string' ? JSON.parse(decodeURIComponent(prop)) : prop) as T;
  return localProp;
};

export const handleConfigureViaWebcProp = (propConfig: Partial<ConfigType>): void => {
  for (const confKey in propConfig) {
    const typedConfigKey = confKey as keyof ConfigType;
    if (propConfig[typedConfigKey] !== undefined) {
      config.set(typedConfigKey, propConfig[typedConfigKey]);
    }
  }
};
