import mergeConfiguration from 'merge-configuration';
import { CracoConfig } from '@craco/craco';
import { getConfig } from '@reactant/config';
import fs from 'fs-extra';

function overrideCracoConfig({
  cracoConfig
}: {
  cracoConfig: CracoConfig;
}): CracoConfig {
  fs.writeFileSync('/tmp/chop', 'a');
  console.log('STARTING TO OVERRIDE');
  const config = getConfig();
  const c = mergeConfiguration<CracoConfig>(cracoConfig, config.craco);
  console.log('c', c);
  return c;
}

module.exports = {
  plugins: [
    {
      plugin: {
        overrideCracoConfig
      }
    }
  ]
} as CracoConfig;
