export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function validateUsername(username: string): {
  isValid: boolean;
  message?: string;
} {
  if (!username) {
    return {
      isValid: false,
      message: 'Username harus diisi'
    };
  }
  
  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Username minimal 3 karakter'
    };
  }

  return { isValid: true };
}

export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password) {
    return {
      isValid: false,
      message: 'Password harus diisi'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password minimal 6 karakter'
    };
  }
  
  return { isValid: true };
}