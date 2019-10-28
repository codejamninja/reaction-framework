import { Context, Options } from '@reactant/types';
import { PlatformApi } from '@reactant/platform';
import { finish } from '@reactant/context';
import bootstrap from './bootstrap';
import logger from '../logger';

export default async function clean(
  platform: string,
  options: Options = {}
): Promise<Context> {
  const context = await bootstrap(platform, options);
  const platformApi = new PlatformApi(context, logger);
  const result = await context.platform.actions.clean(
    context,
    logger,
    platformApi
  );
  finish();
  return result;
}
