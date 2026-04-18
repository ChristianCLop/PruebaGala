// Interfaces de post para controladores y servicios

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostInput {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  imageUrl?: string;
}
