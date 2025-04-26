// ads.model.ts
export interface Ad {
  _id?: string;
  title: string;
  image: {
    public_id: string;
    url: string;
  };
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
}
