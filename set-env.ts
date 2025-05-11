// set-env.ts
import { writeFileSync } from 'fs';

const targetPath = './src/environments/environment.prod.ts';
const envConfigFile = `
export const environment = {
  production: true,
  serverUrl: '${process.env['serverUrl']}',
  googleClientId: '${process.env['googleClientId']}'
};
`;

writeFileSync(targetPath, envConfigFile, { encoding: 'utf8' });
