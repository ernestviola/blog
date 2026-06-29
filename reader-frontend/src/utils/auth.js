const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
};

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
    if (isTokenExpired()) {
      // remove token since expired
      localStorage.removeItem('token');
    } else {
      return payload.usernameId;
    }
  } catch {
    return null;
  }
};

export const setUserFields = (data) => {
  localStorage.setItem('token', data.token);
};

export const getAuthHeader = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const authFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeader(),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    return;
  }

  return response;
};
