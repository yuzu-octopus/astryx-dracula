// Auth copy shared by the four login templates. Single-sourced so the family
// line cannot drift again. SSO-specific strings (Work email, Whisper your
// details, Continue with SSO, provider names) stay per-template in login-sso.
export const AUTH_HEADING = "Welcome back to the night";
export const AUTH_SUBTITLE = "Sign in to your crypt";
export const AUTH_PRIMARY_CTA = "Sign in";
export const AUTH_SIGNUP_PROMPT = "New to the castle?";
export const AUTH_SIGNUP_LINK = "Sign up";
export const AUTH_SSO_DIVIDER = "Or continue with";
export const AUTH_FORGOT_PASSWORD = "Forgot password?";
// Names the problem without apologising, and does not blame one field: a
// mistyped email used to be reported as a wrong password, because this string
// was attached to the password input only.
export const AUTH_ERROR_MESSAGE = "Email or password is wrong. Try again.";
export const AUTH_EMAIL_PLACEHOLDER = "you@castle.dracula";
// The placeholder is the only visible name on the credential inputs, so it has
// to actually name the field. "Whisper your password" named nothing.
export const AUTH_PASSWORD_PLACEHOLDER = "Your password";
export const AUTH_BRAND_NAME = "Castle Dracula";
export const AUTH_TERMS_PREFIX = "By clicking continue, you agree to our";
export const AUTH_TERMS_SERVICE = "Terms of service";
export const AUTH_TERMS_PRIVACY = "Privacy policy";
