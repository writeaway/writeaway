export interface WriteAwaySeoData {
  title: string,
  description: string,
  keywords: string,
  header: string,
}

export type WriteAwaySeoKeyField = keyof WriteAwaySeoData;

export interface WriteAwaySeoState extends WriteAwaySeoData {
  sourceEditorActive: boolean
}
