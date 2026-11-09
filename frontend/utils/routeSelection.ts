type RouteSelectionArguments = {
  // Building the current route goes to, if one has loaded
  routeDestinationId: string | undefined;
  isRouteLoading: boolean;
  selectedBuildingId: string;
};

// Picking a different building cancels the current route, and any pick cancels a loading one
export const shouldCancelRoute = ({
  routeDestinationId,
  isRouteLoading,
  selectedBuildingId,
}: RouteSelectionArguments): boolean =>
  isRouteLoading ||
  (routeDestinationId !== undefined &&
    routeDestinationId !== selectedBuildingId);
