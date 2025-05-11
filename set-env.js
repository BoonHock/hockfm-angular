// set-env.ts
const { writeFileSync } = require('fs');

const targetPath = './src/environments/environment.prod.ts';
const envConfigFile = `
export const environment = {
  production: true,
  serverUrl: '${process.env['serverUrl']}',
  googleClientId: '${process.env['googleClientId']}'
};
`;

writeFileSync(targetPath, envConfigFile, { encoding: 'utf8' });
