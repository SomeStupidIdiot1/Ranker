export type makeList = {
  title: string;
  info?: string;
  imgStringBase64?: string;
};
export type makeItem = {
  titleOfTemplate: string;
  imgStringBase64: string[];
};
export type getList = {
  id: number;
  title: string;
  info: string;
  imageUrl: string | null;
  createdOn: Date;
  lastUpdated: Date;
}[];
export type getSpecificTemplate = {
  title: string;
  info: string;
  templateImageUrl: string | null;
  createdOn: Date;
  lastUpdated: Date;
  items: {
    id: number;
    itemImageUrl: string;
    elo: number;
  }[];
};
