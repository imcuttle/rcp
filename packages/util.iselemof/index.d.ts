/// <reference types="react" />
/**
 * @file index.ts
 * @author imcuttle
 *
 */
import * as React from 'React'
export default function isElementOf(Component: React.ComponentType): (element: React.ReactElement<any>) => boolean
