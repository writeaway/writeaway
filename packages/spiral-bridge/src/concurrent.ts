import type { NamesDict, SFSocket, ISFSocketEvent, Channel } from '@spiralscout/websockets';
import { IPieceItem } from '@writeaway/core';

export const DEFAULT_CHANNEL = 'writeaway';

export const useSpiralWS = (ws: SFSocket, channel: string = DEFAULT_CHANNEL) => (emitter: (item: IPieceItem)=>any) => {
  const chan: Channel = ws.joinChannel(channel);
  const subscription = (event: ISFSocketEvent) => {
    try {
      const parsed: IPieceItem = JSON.parse(event.data!);
      if (parsed.id && parsed.type && parsed.meta) {
        emitter(parsed);
      }
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
  };
  chan.subscribe(<NamesDict.MESSAGE>'message', subscription);
  const unsubscribe = () => {
    chan.leave();
  };
  return unsubscribe;
};
