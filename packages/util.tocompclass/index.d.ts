import * as React from 'react';
/**
 * Convert stateless component class to be component class
 * @public
 * @param {React.ComponentType} component
 * @return {React.ComponentClass<P, S>}
 */
export default function toComponentClass<P = any, S = any>(component: React.ComponentType): React.ComponentClass<P, S>;
