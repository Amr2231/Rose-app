// Testimonials are public submissions (POST /api/testimonials requires no
// auth - see the "name"/"email"/"image" body in the API docs), not tied to
// a user account. So unlike reviews there's no `user` relation to populate;
// the backend just returns a flat { id, name, image, content, rating,
// isApproved, createdAt, updatedAt } record.
declare type TestimonialProps = {
  _id: string;
  name: string;
  image?: string;
  rating: number;
  content: string;
  updatedAt: string;
};
