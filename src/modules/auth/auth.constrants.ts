import { config } from '../../config';

export const refreshTokenName = 'refresh_token';

// Secrets based on token type
export const tokenSecret = {
  access: config.jwt_access_token_secret!,
  refresh: config.jwt_refresh_token_secret!,
};

// ExpiresIns based on token type
export const tokenExpiresIn = {
  access: config.jwt_access_token_expires_in!,
  refresh: config.jwt_refresh_token_expires_in!,
};
