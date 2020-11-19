/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/6
 * @description
 */
import * as React from 'react';
import { IFunction } from '@rcp/_types';
/**
 * The utility for getting display name
 * @public
 * @param {React.ComponentType | React.ReactElement<any> | IFunction | string} component
 * @return {string}
 */
export default function displayName(component: React.ComponentType | React.ReactElement<any> | IFunction | string): string;
