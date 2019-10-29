import { Context, Logger, PlatformApi } from '@reactant/platform';

export default async function start(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
  logger: Logger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _platformApi: PlatformApi
): Promise<any> {
  logger.spinner.start('starting');
  logger.spinner.succeed('started');
}
