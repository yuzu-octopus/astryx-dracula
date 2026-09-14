// Fake-auth pause shared by the four login templates (login, login-card,
// login-split, login-sso). Fixed 2s: plain Promise + setTimeout (no ES2024
// Promise.withResolvers — the ES2022 target breaks strict consumers), awaited
// inside each template's own startTransition.
export function demoLogin(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 2000));
}
