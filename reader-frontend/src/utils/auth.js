export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getUsernameId = () => {
  const usernameId = localStorage.getItem('usernameId');
  if (!usernameId) return null;
  else return usernameId;
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
    navigate('/login', { viewTransition: true });
    return;
  }

  return response;
};
