const mapping: Record<string, string> = {
  pets: 'pet',
  petopias: 'petopia',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
