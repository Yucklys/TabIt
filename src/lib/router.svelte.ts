export enum Route {
  Suggestion = 'suggestion',
  Customize = 'customize',
}

let currentRoute = $state<Route>(Route.Suggestion);
let isLoading = $state<boolean>(false);
let loadingTimer: ReturnType<typeof setTimeout> | null = null;

export function navigate(route: Route) {
  currentRoute = route;
}

export function getRoute(): Route {
  return currentRoute;
}

export function getIsLoading(): boolean {
  return isLoading;
}

export function navigateWithLoading(route: Route, durationMs = 5000) {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
  }
  isLoading = true;
  navigate(route);
  loadingTimer = setTimeout(() => {
    isLoading = false;
    loadingTimer = null;
  }, durationMs);
}
