import * as Keychain from 'react-native-keychain';

const SERVICE = 'kr.co.fomun.settleup.tokens';

export type Tokens = { accessToken: string; refreshToken?: string };

export async function saveTokens(tokens: Tokens) {
  await Keychain.setGenericPassword('auth', JSON.stringify(tokens), {
    service: SERVICE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
}

export async function loadTokens(): Promise<Tokens | null> {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  if (!creds) return null;
  try {
    return JSON.parse(creds.password) as Tokens;
  } catch {
    return null;
  }
}

export async function clearTokens() {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
