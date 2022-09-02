const token = () => {
  const qs = window.location.search;
  const urlParams = new URLSearchParams(qs);
  const access = urlParams.get("code");
  return access;
};

export const access = token();
