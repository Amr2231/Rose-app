declare interface Recommendation {
  _id: string;
  title: string;
  imgCover: string;
  price: number;
  priceAfterDiscount: number;
  rateAvg: number;
  rateCount: number;
  id: string;
}


declare interface RecommendationsResponse {
  message: string;
  count: number;
  recommendations: Recommendation[];
}