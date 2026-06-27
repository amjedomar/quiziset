/**
 * use this instead of "API_BASE_URL_ADAPTED" for anything that will end up in
 * the rendered HTML (e.g. an <img> "src") because "API_BASE_URL_ADAPTED" has
 * a different hostname during SSR (when running inside docker) which would
 * cause a Hydration issue on browser
 *
 * However, this constant always has the same static value on server and the browser
 */
export const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

/**
 * use this "API_BASE_URL_ADAPTED" for JavaScript `fetch()` logic code
 *
 * because in case of:
 *  - SSR
 *  - or scripts config such as "orval.config.ts" (which is used when
 *    running "npm run generate:api-client")
 *
 * it modifies the url hostname so it can be run inside the
 * docker container :)
 *
 * However, in browser it will always switch to be the same url
 * `NEXT_PUBLIC_API_BASE_URL` (whether the nextjs process was running
 * inside or outside the docker container)
 *
 * Please NEVER use this variable for things that will end up in
 * the rendered HTML (in this case use `NEXT_PUBLIC_API_BASE_URL`
 * instead) to avoid Hydration issues
 */
export const API_BASE_URL_ADAPTED = ((): string => {
  const DOCKER_BACKEND_CONTAINER_HOST = process.env.DOCKER_BACKEND_CONTAINER_HOST

  let resultUrl = NEXT_PUBLIC_API_BASE_URL

  // is running inside docker container? if yes then change hostname (as mentioned above)
  if (DOCKER_BACKEND_CONTAINER_HOST) {
    const apiUrl = new URL(NEXT_PUBLIC_API_BASE_URL)
    apiUrl.hostname = DOCKER_BACKEND_CONTAINER_HOST

    resultUrl = apiUrl.toString()
  }

  // make sure there is no trailing slash at the end
  return resultUrl.endsWith('/') ? resultUrl.slice(0, -1) : resultUrl
})()
