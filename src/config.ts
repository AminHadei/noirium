import axios from 'redaxios';
import type { Component } from 'vue';

export interface ConfigType {
  webComponentPrefix: string;
  apiBaseUrl?: string;
  /** Optional CDN base for static assets (e.g. country flag SVGs). */
  assetsCdnUrl?: string;
  axiosInstance: ReturnType<(typeof axios)['create']>;
  /**
   * Component used to render image elements inside Noirium UI (e.g. `Avatar`).
   * Defaults to the native `'img'` tag. Hosts that want optimized images can
   * override at boot — e.g. `config.set('imageComponent', NuxtImg)`.
   */
  imageComponent: string | Component;
}

const apiBaseUrl = import.meta.env['VITE_BASE_URL'] ?? '';

export const config = {
  config: {
    webComponentPrefix: 'noirium-',
    apiBaseUrl,
    imageComponent: 'img',
    axiosInstance: axios.create({
      baseURL: apiBaseUrl,
      withCredentials: true,
    }),
  } as ConfigType,

  get<K extends keyof ConfigType>(keyName: K): ConfigType[K] {
    return this.config[keyName] as ConfigType[K];
  },

  set<K extends keyof ConfigType>(key: K, value: ConfigType[K]): void {
    this.config[key] = value;
    if (key === 'apiBaseUrl') {
      this.set(
        'axiosInstance',
        axios.create({
          baseURL: this.get('apiBaseUrl') ?? '',
          withCredentials: true,
        }),
      );
    }
  },
};
