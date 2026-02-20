export enum Route {
  Suggestion = 'suggestion',
  Customize = 'customize',
}

let currentRoute = $state<Route>(Route.Suggestion);
let isLoading = $state<boolean>(false);

export function navigate(route: Route) {
  currentRoute = route;
}

export function getRoute(): Route {
  return currentRoute;
}

export function getIsLoading(): boolean {
  return isLoading;
}

export async function navigateWithLoading(route: Route, asyncWork: () => Promise<void>) {
  isLoading = true;
  navigate(route);
  try {
    await asyncWork();
  } catch (err) {
    console.error('Error during navigation work:', err);
  } finally {
    isLoading = false;
  }
}
