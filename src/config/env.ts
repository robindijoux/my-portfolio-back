export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  DATABASE: {
    TYPE: 'postgres' as const,
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    USERNAME: process.env.DB_USERNAME || 'portfolio_user',
    PASSWORD: process.env.DB_PASSWORD || 'portfolio_password',
    NAME: process.env.DB_NAME || 'portfolio',
    SYNC: process.env.DB_SYNC === 'true' || false,
  },
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  STORAGE: {
    PROVIDER: process.env.STORAGE_PROVIDER || 's3',
    S3: {
      REGION: process.env.S3_REGION || 'eu-west-1',
      BUCKET: process.env.S3_BUCKET || 'my-portfolio-media',
      ENDPOINT: process.env.S3_ENDPOINT, // optional (e.g., MinIO)
      FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE === 'true' || false,
      PUBLIC_BASE_URL: process.env.S3_PUBLIC_BASE_URL, // optional CDN/base URL override
    },
  },
};
