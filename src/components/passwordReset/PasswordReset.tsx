import type React from "react";
import { useState } from "react";
import "./passwordReset.css";
import { requestPasswordReset } from "../../auth/operations";
import { useAuthStore } from "../../stores/auth";

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState("");
  const isLoading = useAuthStore((state) => state.isLoading);
  const resetPasswordFail = useAuthStore((state) => state.resetPasswordFail);
  const resetPasswordSuccess = useAuthStore(
    (state) => state.resetPasswordSuccess,
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = () => {
    requestPasswordReset(email);
  };

  return (
    <div className="password-reset-page">
      <h1>Reset Password</h1>
      Email address:
      <input type="email" value={email} onChange={handleEmailChange} />
      <button className="reset-button" onClick={handleResetPassword}>
        Reset Password
      </button>
      {isLoading && <p>Requesting reset...</p>}
      {resetPasswordFail && <p>Request failed. Check server status.</p>}
      {resetPasswordSuccess && (
        <p>
          If an account with the provided email exists, a password reset link
          has been sent!
        </p>
      )}
    </div>
  );
};

export default PasswordReset;
