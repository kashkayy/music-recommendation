import { useCallback, useState } from "react";
export default function usePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const handlePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);
  const handleConfirm = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);
  const handleCheckPassword = useCallback((password, confirmPassword) => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, []);

  const handleValidatePassword = useCallback((password, minLength) => {
    if (password.length < minLength && password.length > 0) {
      setValidPassword(false);
      return false;
    } else {
      setValidPassword(true);
      return true;
    }
  }, []);
  const handleUsername = useCallback((username) => {
    if (username.trim().length === 0) {
      return false;
    }
    return true;
  }, []);
  return {
    showPassword,
    handlePasswordVisibility,
    handleConfirm,
    showConfirmPassword,
    handleCheckPassword,
    passwordsMatch,
    handleUsername,
    validPassword,
    handleValidatePassword,
  };
}
