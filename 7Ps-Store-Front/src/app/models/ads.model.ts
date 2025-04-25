// ads.model.ts
export interface Ad {
  _id?: string;
  title: string;
  imageUrl: string;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
}
