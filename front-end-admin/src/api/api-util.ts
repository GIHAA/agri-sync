/* eslint-disable prettier/prettier */
/**
 * Create a url search params for get requests
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const castToURLQueryParamsString = (params: any) => {
  const queryArr = Object.keys(params).map((key) => {
    if (Array.isArray(params[key])) {
      return `${key}=${JSON.stringify(params[key])}`
    }
    if (params[key] !== 0 && params[key] !== '') {
      return `${key}=${params[key]}`
    }
    return null
  })

  const queryString = queryArr
    .filter((arr) => arr !== null)
    .join('&');

  return queryString;
}

/* TODO: Remove after add another function */
// eslint-disable-next-line import/prefer-default-export
export { castToURLQueryParamsString }
