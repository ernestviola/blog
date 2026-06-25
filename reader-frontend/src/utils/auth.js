export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now() && payload.sub;
  } catch {
    return false;
  }
};

export const getUsernameId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      // is expired return null
      localStorage.removeItem('token');
    } else {
      const usernameId = localStorage.setItem(
        'usernameId',
        payload?.usernameId,
      );
      return usernameId;
    }
  } catch {
    return null;
  }
};

export const setUserFields = (data) => {
  localStorage.setItem('token', data.token);
};

export const getAuthHeader = () => {
  if (isLoggedIn()) {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
  }
  return {};
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const authFetch = async (url, options = {}, navigate) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeader(),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('usernameId');
    navigate('/login', { viewTransition: true });
    return;
  }

  return response;
};
