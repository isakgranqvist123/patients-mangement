function requiredEnv(name: string): string {
  const value = process.env[name];

  if (value === undefined) {
    throw new Error(`Environment variable ${name} is required but not set.`);
  }

  return value;
}

export default {
  PORT: requiredEnv('PORT'),
  MONGO_URI: requiredEnv('MONGO_URI'),
  JWT_SECRET: requiredEnv('JWT_SECRET'),
};
