export interface Post {
  id: string;
  title: string;
  url: string;
  caption: string;
  author: string;
  authorId: string;
  points: number;
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
  previewImage?: string;
  domain?: string;
}

export interface UserStats {
  totalUsers: number;
  onlineUsers: number;
}

export interface URLPreview {
  title: string;
  description: string;
  image: string;
  domain: string;
}
