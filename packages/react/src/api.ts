import { defaultMinimumApi as BasicApi, IPieceItem, IPiecesAPI } from '@writeaway/core';

const imageListBg = require('api/imagesBg');
const imageList = require('api/images');

export const api: Partial<IPiecesAPI> = {
  /* api for get gallery image list */
  getImageList: (data: any) => ((data && data.type === 'background') ? Promise.resolve(imageListBg.data.list) : Promise.resolve(imageList.data.list)),
  /* example of api for real-time updates */
  subscribe: (fn) => {
    const interval = setInterval(() => {
      fn({
        id: 'html-rt',
        data: {
          html: ''
            + '<p>WriteAway support real-time updates. This block will revert itself'
            + ' automatically every 30 seconds simulating updates coming from server.</p>',
        },
        meta: { id: 'timer', label: 'Timer', time: Date.now() },
      });
    }, 30000);
    return () => clearInterval(interval);
  },
  /* example of api for delete images */
  deleteImage: () => Promise.resolve(true),
  uploadImage: (file: File | FileList) => new Promise((resolve) => {
    if ((file as FileList).length && (file as FileList).item(0)!.size <= 200 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          src: e.target!.result as any,
          id: Date.now().toString(),
        });
      };
      reader.readAsDataURL((file as FileList).item(0)!);
    } else {
      // eslint-disable-next-line no-alert
      alert('Try file smaller than 200Kb to see it directly, demo one will be used instead');
      setTimeout(() => {
        resolve({
          src: 'http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg',
          thumbnailSrc: 'http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg',
          width: 680,
          height: 606,
          id: Date.now().toString(),
        });
      }, 100);
    }
  }),
  getPieceData: async (piece: IPieceItem) => BasicApi.getPieceData(piece, BasicApi.resolvers).then((p: IPieceItem) => {
    if (p.id === 'pieceSource2') {
      // eslint-disable-next-line no-param-reassign
      p.data.updateNode = false;
    }
    return p;
  }),
  savePieceData: async (piece: IPieceItem) => {
    // eslint-disable-next-line no-console
    console.info('Saving to server', piece);
    if (piece.id === 'errorSample') {
      throw new Error('This is a sample error');
    }
    return Promise.resolve(piece);
  },
};
