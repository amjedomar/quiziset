import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

const envSampleFilePath = path.join(__dirname, '..', '.env.sample');
const envFilePath = path.join(__dirname, '..', '.env');

const envSample = fs.readFileSync(envSampleFilePath, 'utf8');

function generateSecret(length: number): string {
  if (length % 2 !== 0) {
    throw new Error('generateSecret: please pass an even number for length');
  }

  const size = length / 2;

  return crypto.randomBytes(size).toString('hex');
}

function getNewEnv(dynamicVariables: Record<string, string>): string {
  let result = envSample;

  for (const [varKey, varValue] of Object.entries(dynamicVariables)) {
    const regex = new RegExp(`\\$${varKey}`, 'g');
    result = result.replace(regex, varValue);
  }

  return result;
}

const newEnv = getNewEnv({
  JWT_SECRET: generateSecret(128),
});

fs.writeFileSync(envFilePath, newEnv);

console.log('\n.env file generated successfully!\n');
