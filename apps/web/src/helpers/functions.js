export const buildQueryString = (params) => {
    const urlParams = new URLSearchParams(params);
    return urlParams.toString();
};
