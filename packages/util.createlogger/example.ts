/**
 * @file example.ts
 * @author Cuttle Cong
 * @date 2018/9/8
 *
 */

import browser from './browser'
import node from './index'

const nLogger = node('node')
const bLogger = browser('browser')

nLogger.success('')
