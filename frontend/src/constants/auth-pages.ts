// routes that require the user to be logged in
// IMPORTANT!!!: when you add/remove routes here also update the static "matcher" in proxy.ts
export const PROTECTED_ROUTES = ['/manage-quizzes', '/quizzes/:quizId/session', '/favorites', '/profile']

// routes that can be accessed only if the user is logged out
// IMPORTANT!!!: when you add/remove routes here also update the static "matcher" in proxy.ts
export const GUEST_ONLY_ROUTES = ['/login', '/signup']
