import type React from "react";
import { useState } from "react";
import "./passwordReset.css";
import { resetPassword } from "../../actions/authentication";
import { useAppDispatch, useAppSelector } from "../../hooks";

const PasswordReset: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const isLoading = useAppSelector((state) => state.authentication.isLoading);
  const resetPasswordFail = useAppSelector(
    (state) => state.authentication.resetPasswordFail,
  );
  const resetPasswordSuccess = useAppSelector(
    (state) => state.authentication.resetPasswordSuccess,
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = () => {
    dispatch(resetPassword(email));
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
