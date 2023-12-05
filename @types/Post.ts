type Post = {
  content?: string | null;
  name: string;
  username: string;
  authorID: string;
  category?:
    | "art"
    | "music"
    | "hybrid"
    | "theatre"
    | "literature"
    | "science"
    | "sports"
    | "other";
  tags?: string[];
  image?: string;
  featured?: boolean;
  likes?: string[];
  comments?: {
    userId: string;
    content: string;
    username: string;
    timestamp: string;
    userImg: string;
    url: string;
    name: string;
  }[];
  userImg?: string;
  url?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
