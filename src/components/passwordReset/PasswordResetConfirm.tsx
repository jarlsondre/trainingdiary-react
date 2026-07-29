import "./passwordResetConfirm.css";
import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { confirmPassword } from "../../actions/authentication";
import { useAppDispatch, useAppSelector } from "../../hooks";

const PasswordResetConfirm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { username, token } = useParams<{ username: string; token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const isLoading = useAppSelector((state) => state.authentication.isLoading);
  const confirmPasswordFail = useAppSelector(
    (state) => state.authentication.confirmPasswordFail,
  );
  const confirmPasswordSuccess = useAppSelector(
    (state) => state.authentication.confirmPasswordSuccess,
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPassword = () => {
    if (!username || !token) return;
    dispatch(confirmPassword(username, token, newPassword));
  };

  return (
    <div className="password-reset-confirm-page">
      <h1>Confirm New Password</h1>
      New password:
      <input
        type="password"
        value={newPassword}
        onChange={handlePasswordChange}
      />
      <button className="reset-confirm-button" onClick={handleConfirmPassword}>
        Confirm Password
      </button>
      {isLoading && <p>Confirming password...</p>}
      {confirmPasswordFail && (
        <p>
          Failed to confirm new password. Token has probably expired. Try again
          with a new link.{" "}
        </p>
      )}
      {confirmPasswordSuccess && <p>Password confirmed!</p>}
    </div>
  );
};

export default PasswordResetConfirm;
