import { sizes } from "@frontend/theme/sizes";
import { radius, space } from "@frontend/theme/spacing";

export function getLayoutVariables(): Record<string, string> {
  const variables: Record<string, string> = {};

  const add = (value: unknown, path: string) => {
    if (typeof value === "number") {
      variables[`--${path}`] = `${value}px`;
    } else if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, child]) => {
        add(child, path ? `${path}-${key}` : key);
      });
    }
  };

  add(space, "space");
  add(radius, "radius");
  add(sizes, "size");

  return variables;
}
