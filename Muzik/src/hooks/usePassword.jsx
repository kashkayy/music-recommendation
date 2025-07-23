import { useCallback, useState } from "react";
export default function usePassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const handlePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);
    const handleConfirm = useCallback(() => {
        setShowConfirmPassword((prev) => !prev);
    }, []);
    const handleCheckPassword = useCallback((password, confirmPassword) => {
        if (confirmPassword) {
            setPasswordsMatch(password === confirmPassword)
        } else {
            setPasswordsMatch(true)
        }
    }, []);
    return { showPassword, handlePasswordVisibility, handleConfirm, showConfirmPassword, handleCheckPassword, passwordsMatch };
}
