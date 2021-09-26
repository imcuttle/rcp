/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'react'
/**
 * Determinate the input is element of the component class
 * @public
 * @param {React.ComponentType} Component
 * @return {(element: React.ReactElement<any>) => boolean}
 */
export default function isElementOf(Component: React.ComponentType): (element: React.ReactElement<any>) => boolean
