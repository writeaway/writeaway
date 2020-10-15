import { IWriteAwayStateExtension } from '@writeaway/core';
import { IToastrStateExtension } from '@writeaway/core/dist/types';

type Common = (IWriteAwayStateExtension & IToastrStateExtension);

export interface IApplicationState extends Common {
  app: {

  }
}
