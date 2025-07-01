export function getEnvOrThrow<T = string>(key: string): T {
  const value = process.env[key];

  if (!value || value.trim() === '') {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value as T;
}