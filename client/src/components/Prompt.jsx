import React, { useEffect } from 'react';
import { useLocation, useNavigate, UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export const Prompt = ({ when, message, action }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unblock = navigate.block((tx) => {
      if (!when) return true;
      if (window.confirm(message)) {
        action(); 
        unblock();
        tx.retry();
      }
    });
    return unblock;
  }, [when, message, action, navigate]);

  return null;
};
