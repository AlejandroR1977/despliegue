import { z } from 'zod'
export const username = z.string({
  required_error: 'El nombre de usuario es requerido',
  invalid_type_error: 'El nombre de usuario debe de ser una cadena de texto'
})
  .min(10, 'El nombre de usuario debe de tener al menos 10 caracteres')
  .max(35, 'El nombre de usuario debe de tener como máximo 35 caracteres')
  .regex(/^[a-zA-Z0-9]+$/, 'El nombre de usuario solo puede contener letras y números')

export const password = z.string({
  required_error: 'La contraseña es requerida',
  invalid_type_error: 'La contraseña debe de ser una cadena de texto'
})
  .min(8, 'La contraseña debe de tener al menos 8 caracteres')
  .max(64, 'La contraseña debe de tener como máximo 64 caracteres')
  .regex(/(?=.*[a-z])/, 'La contraseña debe tener al menos una minúscula')
  .regex(/(?=.*[A-Z])/, 'La contraseña debe tener al menos una mayúscula')
  .regex(/(?=.*[\W_])/, 'La contraseña debe tener al menos un caracter especial')

export const phone_number = z.string({
  required_error: 'El número de teléfono es requerido',
  invalid_type_error: 'El número de teléfono debe de ser una cadena de texto'
})
  .regex(/^\d+$/, 'El número de teléfono solo puede contener números')
  .min(10, 'El número de teléfono debe de tener al menos 10 caracteres')
  .max(10, 'El número de teléfono debe de tener como máximo 10 caracteres')

export const email = z.string({
  required_error: 'El email es requerido',
  invalid_type_error: 'El email debe de ser una cadena de texto'
})
  .email('El email debe de ser un email válido')
  .max(100, 'El email debe de tener como máximo 100 caracteres')


export const LogInInputSchema = z.object({ username: z.string(), password: z.string() })
export const LogInOutputSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  email: z.string(),
  phone_number: z.string(),
  role: z.string()
})

export const SignUpInputSchema = z.object({
  username,
  password,
  email,
  phone_number
})
