import { z } from 'zod';

/*
 * TODO [FE1 - Validacija unosa | Developer: Marta Suljagic]
 *
 * Dodati / ojacati sledece validacije i primeniti ih na sve forme za
 * kreiranje i izmenu korisnika (klijenata) i zaposlenih:
 *
 *  1. Telefon — dozvoliti samo cifre uz opcioni vodeci znak '+';
 *     primer regex: /^\+?[0-9]{6,15}$/ (E.164 kompatibilan opseg).
 *     Azurirati phoneSchema ili dodati strictPhoneSchema.
 *
 *  2. Datum rodjenja — mora biti u proslosti (< today);
 *     koristiti z.string().refine(val => new Date(val) < new Date(), ...)
 *     ili z.date().max(new Date(), ...).
 *     Primeniti u createClientSchema, editClientSchema, createEmployeeSchema.
 *
 *  3. Email format — emailSchema vec postoji (z.string().email()), ali proveriti
 *     da li je dodat i na edit-forme (EmployeeEditPage, ClientEditPage).
 *     Ukoliko nije, uvesti emailSchema iz ovog fajla umesto lokalnih duplikata.
 *
 *  Napomena: izmene sheme automatski propagiraju validaciju na FE forme
 *  koje koriste react-hook-form + zodResolver — nije potrebna promena logike u
 *  komponentama, samo azuriranje schema objekata.
 */

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

// TODO_final C1 #1 — strict E.164 telefon: samo cifre uz opcioni '+' na pocetku,
// duzine 6-15 karaktera (E.164 max je 15 cifara). Razmaci/crtice vise nisu dozvoljeni.
export const phoneSchema = z
  .string()
  .min(1, 'Broj telefona je obavezan')
  .regex(
    /^\+?[0-9]{6,15}$/,
    'Telefon moze sadrzati samo cifre i opcioni + na pocetku, 6-15 karaktera',
  );

// TODO_final C1 #1 — dateOfBirth ne sme biti u buducnosti.
// Spec Celina 1: datum rodjenja je istorijski podatak.
export const dateOfBirthSchema = z
  .string()
  .min(1, 'Datum rodjenja je obavezan')
  .refine((val) => {
    const d = new Date(val);
    return !Number.isNaN(d.getTime());
  }, 'Unesite validan datum')
  .refine((val) => {
    const d = new Date(val);
    return d < new Date();
  }, 'Datum rodjenja ne sme biti u buducnosti');

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
