/**
* Example of how to use @react-input-validator packages
 * https://github.com/atmulyana/react-input-validator
  */
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("home.tsx"),
    route('bootstrap', 'home-bootstrap.tsx'),
] satisfies RouteConfig;
