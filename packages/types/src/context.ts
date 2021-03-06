import { Config } from './config';
import { LoadedPlatform, PlatformOptions } from './platform';
import { LoadedPlugins, PluginsOptions } from './plugin';

export interface Dependencies {
  [key: string]: string;
}

export interface Pkg {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  name: string;
  peerDependencies?: Dependencies;
}

export interface ContextEnvs {
  [key: string]: string;
}

export interface Options {
  analyze?: boolean;
  args: string[];
  config: Partial<Config>;
  debug: boolean;
  docker?: boolean;
}

export interface Context {
  action: string;
  config?: Config;
  debug: boolean;
  envs: ContextEnvs;
  includePaths: string[];
  logLevel: string | number;
  masterPid: number;
  options: Options;
  paths: Paths;
  pkg: Pkg;
  platform: LoadedPlatform | null;
  platformName: string;
  platformNames: string[];
  plugins: LoadedPlugins;
  state: { [key: string]: any };
}

export type SyncContextCallback = (
  context: Context
) => Context | Promise<Context>;

export type Path = string;

export interface Paths {
  build: Path;
  dist: Path;
  reactant: Path;
  root: Path;
  tmp: Path;
  [key: string]: Path;
}

export class GlobalReactant {
  config?: Config;

  context?: Context;

  platformOptions?: PlatformOptions;

  pluginsOptions?: PluginsOptions;
}
