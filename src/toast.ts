import {InjectionKey} from 'vue';

export type Toast = {
  title: string;
  text: string;
  type: string;
  duration: number;
};

export const key: InjectionKey<(toast: Toast) => void> = Symbol();
