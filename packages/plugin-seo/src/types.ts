export interface RedaxtorSeoData {
  title: string,
  description: string,
  keywords: string,
  header: string,
}

export type RedaxtorSeoKeyField = keyof RedaxtorSeoData;

export interface RedaxtorSeoState extends RedaxtorSeoData {
  sourceEditorActive: boolean
}
