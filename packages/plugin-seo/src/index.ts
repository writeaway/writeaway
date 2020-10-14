import { IComponent } from '@writeaway/core';
import { RedaxtorSeoData } from 'types';
import { RedaxtorSeo } from './RedaxtorSeo';

import 'google-preview.less';

export * from 'types';

export const WriteAwaySeo: IComponent<RedaxtorSeoData> = RedaxtorSeo;

export default WriteAwaySeo;
