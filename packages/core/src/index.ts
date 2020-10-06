import { Redaxtor } from './Redaxtor';
import 'styles/redaxtor.less';

export * from './types';

// Includes version and time in bundle
export const version = `Version ${process.env.VERSION}, built at ${process.env.BUILD_TIME}`;

export default Redaxtor;
