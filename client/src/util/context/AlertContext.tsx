// AuthContext.js
import React, { createContext, useMemo, useState } from 'react';
import { AnyChildren } from '../types/generic';

interface Alert {
  state: string;
  text: string;
  setAlert: (text: string, type: string) => void;
}

const ALERT_TIME = 5000;

const AlertContext = createContext<Alert>({
  state: '',
  text: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAlert: () => {},
});

function AlertProvider({ children }: AnyChildren) {
  const [notification, setNotification] = useState<string>('');
  const [notificationText, setNotificationText] = useState<string>('');

  const setAlert = (text: string, type: string) => {
    setNotification(type);
    setNotificationText(text);
    setTimeout(() => {
      setNotification('');
      setNotificationText('');
    }, ALERT_TIME);
  };

  const providerContext: Alert = useMemo(() => {
    return {
      state: notification,
      text: notificationText,
      setAlert,
    };
  }, [notificationText, notification]);
  return (
    <AlertContext.Provider value={providerContext}>
      {children}
    </AlertContext.Provider>
  );
}

export { AlertProvider };
export default AlertContext;
