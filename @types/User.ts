type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  image: string | null;
  bio: string | null;
  followers: string[] | null;
  following: string[] | null;
  verified: boolean | null;
  role: string | null;
  likes: string[] | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // For the frontend
  id: string | null | undefined;
  accessToken: string | null | undefined;
};