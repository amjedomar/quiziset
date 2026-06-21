/**
 * use this "API_BASE_URL" instead of "process.env.NEXT_PUBLIC_API_BASE_URL"
 *
 * because in SSR (or scripts config such as "orval.config.ts")
 * it adapts the hostname in case the npm script (i.e. "npm run dev" or "npm run generate:api-client")
 * was running inside the docker container :)
 *
 * btw this apply for SSR only! however in browser it will always be the same url
 * (whether the nextjs process was running inside or outside docker container)
 */
export const API_BASE_URL = ((): string => {
  const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
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
