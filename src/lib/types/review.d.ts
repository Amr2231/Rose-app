export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
  photo: string;
}

export interface ReviewProduct {
  _id: string;
  title: string;
  imgCover: string;
}

export interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  status: string;
  createdAt: string;
  user: ReviewUser;
  product: ReviewProduct;
}
