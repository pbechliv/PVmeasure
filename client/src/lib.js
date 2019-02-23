export const setFetchHeaders = (method, body, noToken = false) => {
  const fetchHeaders = {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    },
    body
  };
  if (noToken) delete fetchHeaders.headers.Authorization;
  return fetchHeaders;
};
