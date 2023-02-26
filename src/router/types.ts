import { defineComponent } from 'vue';

export type Component<T extends any = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

export interface TRouterMeta {
  title: string;
  keepAlive?: boolean;
  icon?: any;
  permission?: Array<string>;
  target?: string;
  hidden?: boolean;
  hiddenHeaderContent?: boolean;
  hideHeader?: boolean;
  blank?: boolean
}

export interface TRouter {
  name: string;
  path: string;
  redirect?: string
  meta?: TRouterMeta;
  component?: Component | string;
  children?: TRouter[];
  hidden?: boolean
  hideChildrenInMenu?: boolean
}
