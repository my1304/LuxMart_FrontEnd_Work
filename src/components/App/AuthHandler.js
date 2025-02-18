import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LoginUser from "../User/LoginUser";
import LogoutUser from "../User/LogoutUser";
import { logoutUser } from "../../features/user/userSlice";
import Main from "./Main";

const AuthHandler = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const dispatch = useDispatch();

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const handleUnload = async () => {
      await dispatch(logoutUser()).unwrap();
    };
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [dispatch]);

  const handleConfirmLogout = async () => {
    setIsLoggedIn(false);
    setUserData(null);
    setShowLogoutDialog(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginUser
        onSubmit={handleLoginSuccess}
        onFailure={() => window.close()}
      />
    );
  }

  return (
    <div className="AuthHandler">
      {showLogoutDialog ? (
        <LogoutUser
          userData={userData}
          onConfirm={handleConfirmLogout}
          onClose={() => setShowLogoutDialog(false)}
        />
      ) : (
        <Main userData={userData} onLogout={() => setShowLogoutDialog(true)} />
      )}
    </div>
  );
};

export default AuthHandler;
