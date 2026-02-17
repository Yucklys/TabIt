export enum Route {
  Suggestion = 'suggestion',
  Customize = 'customize',
}

let currentRoute = $state<Route>(Route.Suggestion);

export function navigate(route: Route) {
  currentRoute = route;
}

export function getRoute(): Route {
  return currentRoute;
}
