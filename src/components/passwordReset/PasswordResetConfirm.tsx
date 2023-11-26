import "./passwordResetConfirm.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { confirmPassword } from "../../actions/authentication";

const PasswordResetConfirm: React.FC = () => {
  const dispatch = useDispatch();
  const { username, token } = useParams<{ username: string; token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const isLoading = useSelector((state: any) => state.authentication.isLoading);
  const confirmPasswordFail = useSelector(
    (state: any) => state.authentication.confirmPasswordFail
  );
  const confirmPasswordSuccess = useSelector(
    (state: any) => state.authentication.confirmPasswordSuccess
  );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPassword = () => {
    dispatch(confirmPassword(username!, token!, newPassword));
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
