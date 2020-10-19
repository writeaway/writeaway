import { IComponent } from '@writeaway/core';
import { WriteAwaySeoData } from 'types';
import { WriteAwaySeo as Editor } from './WriteAwaySeo';

import 'google-preview.less';

export * from 'types';

export const WriteAwaySeo: IComponent<WriteAwaySeoData> = Editor;

export default WriteAwaySeo;
