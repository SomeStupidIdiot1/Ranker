export type makeList = {
  title: string;
  info?: string;
  imgStringBase64?: string;
};
export type makeItem = {
  itemName: string;
  titleOfTemplate: string;
  imgStringBase64?: string;
};
export type getList = {
  id: number;
  title: string;
  info: string;
  imageUrl: string | null;
  createdOn: Date;
  lastUpdated: Date;
}[];
