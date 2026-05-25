import { z } from 'zod';

// ============================================================
// Validacione šeme za Banka 2025 - Celina 1
// Password constraints: min 8, max 32, 2 broja, 1 veliko, 1 malo
// ============================================================

export const emailSchema = z
  .string()
  .min(1, 'Email je obavezan')
  .email('Unesite validan email format');

export const passwordSchema = z
  .string()
  .min(8, 'Lozinka mora imati najmanje 8 karaktera')
  .max(32, 'Lozinka može imati najviše 32 karaktera')
  .refine((val) => (val.match(/[0-9]/g) || []).length >= 2, {
    message: 'Lozinka mora sadržati najmanje 2 broja',
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Lozinka mora sadržati najmanje 1 veliko slovo',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Lozinka mora sadržati najmanje 1 malo slovo',
  });

// Strict E.164 telefon: samo cifre uz opcioni '+' na pocetku, duzine 6-15
// karaktera (E.164 max je 15 cifara). Razmaci/crtice nisu dozvoljeni.
export const phoneSchema = z
  .string()
  .min(1, 'Broj telefona je obavezan')
  .regex(
    /^\+?[0-9]{6,15}$/,
    'Telefon moze sadrzati samo cifre i opcioni + na pocetku, 6-15 karaktera',
  );

// dateOfBirth ne sme biti u buducnosti — spec Celina 1: datum rodjenja je
// istorijski podatak. UTC normalizacija (FE-SHR-03 fix 25.05.2026):
// `<input type="date">` daje ISO "YYYY-MM-DD" koji `new Date(...)` parsira
// kao 00:00 UTC. `new Date()` je lokalno vreme. U pozitivnim TZ-ovima
// (npr. Belgrade +02:00), today je rejected jer 00:00 UTC < trenutno;
// u negativnim TZ-ovima sutra moze biti accepted. Resenje: obe strane
// normalizovati na UTC midnight + strict "<" da today bude rejected
// (datum rodjenja MORA biti u proslosti).
export const dateOfBirthSchema = z
  .string()
  .min(1, 'Datum rodjenja je obavezan')
  .refine((val) => {
    const parts = val.split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return false;
    const [y, m, d] = parts;
    const inputUtc = Date.UTC(y, m - 1, d);
    return !Number.isNaN(inputUtc);
  }, 'Unesite validan datum')
  .refine((val) => {
    const [y, m, d] = val.split('-').map(Number);
    const inputUtc = Date.UTC(y, m - 1, d);
    const now = new Date();
    const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return inputUtc < todayUtc; // strict: today is rejected (mora biti u proslosti)
  }, 'Datum rodjenja mora biti u proslosti');

export const nameSchema = z
  .string()
  .min(1, 'Ovo polje je obavezno')
  .max(100, 'Maksimalno 100 karaktera');

// Login forma
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Lozinka je obavezna'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// Kreiranje zaposlenog
export const createEmployeeSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  username: z.string().min(1, 'Username je obavezan'),
  email: emailSchema,
  position: z.string().min(1, 'Pozicija je obavezna'),
  phoneNumber: phoneSchema,
  isActive: z.boolean(),
  address: z.string().min(1, 'Adresa je obavezna'),
  dateOfBirth: dateOfBirthSchema,
  gender: z.string().min(1, 'Pol je obavezan'),
  department: z.string().min(1, 'Odeljenje je obavezno'),
});
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

// Editovanje zaposlenog
export const editEmployeeSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  position: z.string().min(1, 'Pozicija je obavezna'),
  phoneNumber: phoneSchema,
  isActive: z.boolean(),
  address: z.string().min(1, 'Adresa je obavezna'),
  dateOfBirth: dateOfBirthSchema,
  gender: z.string().min(1, 'Pol je obavezan'),
  department: z.string().min(1, 'Odeljenje je obavezno'),
});
export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;

// Aktivacija naloga
export const activateAccountSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Potvrdite lozinku'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });
export type ActivateAccountFormData = z.infer<typeof activateAccountSchema>;

// Forgot password
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password
export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Potvrdite lozinku'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
