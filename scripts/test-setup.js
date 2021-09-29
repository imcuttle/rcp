/**
 * @file test-setup
 * @author Cuttle Cong
 * @date 2018/9/7
 *
 */

import { configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
configure({ adapter: new Adapter() })
