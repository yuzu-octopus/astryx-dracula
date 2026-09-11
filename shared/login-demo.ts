// Fake-auth delay shared by the four login templates (login, login-card,
// login-split, login-sso). Plain Promise + setTimeout: ES2024
// Promise.withResolvers under an ES2022 target breaks strict consumers, so
// the templates await this helper inside their own startTransition instead.
export const DEMO_LOGIN_DELAY_MS = 2000;

export function demoLogin(
  delayMs: number = DEMO_LOGIN_DELAY_MS,
): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delayMs));
}
