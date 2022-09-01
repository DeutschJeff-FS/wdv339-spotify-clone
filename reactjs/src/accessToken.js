const getToken = () => {
  const qs = window.location.search;
  const urlParams = new URLSearchParams(qs);
  const accessToken = urlParams.get("access_token");
  return accessToken;
};

export const accessToken = getToken();
