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
  // Configuration AWS centralisée
  AWS: {
    REGION: process.env.AWS_REGION || 'eu-west-3',
    S3: {
      BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || 'my-portfolio-media',
      ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    },
    COGNITO: {
      USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
      CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
      REGION: process.env.AWS_REGION || 'eu-west-3',
    },
  },
};
