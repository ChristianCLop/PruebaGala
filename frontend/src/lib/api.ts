// API

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  status: "error";
  message: string;
  errors?: { field: string; message: string }[];
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      status: "error",
      message: "Unexpected error",
    }));
    throw new Error(error.message ?? "Request failed");
  }
  // Estado 204
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  return json.data as T;
}

export const api = {
  getAllPosts: (): Promise<Post[]> =>
    fetch(`${API_URL}/posts`).then((r) => handleResponse<Post[]>(r)),

  getPostById: (id: number): Promise<Post> =>
    fetch(`${API_URL}/posts/${id}`).then((r) => handleResponse<Post>(r)),

  getPostBySlug: (slug: string): Promise<Post> =>
    fetch(`${API_URL}/posts/slug/${slug}`).then((r) => handleResponse<Post>(r)),

  createPost: (data: {
    title: string;
    content: string;
    imageUrl?: string;
  }): Promise<Post> =>
    fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<Post>(r)),

  updatePost: (
    id: number,
    data: { title?: string; content?: string; imageUrl?: string }
  ): Promise<Post> =>
    fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handleResponse<Post>(r)),

  deletePost: (id: number): Promise<void> =>
    fetch(`${API_URL}/posts/${id}`, { method: "DELETE" }).then((r) =>
      handleResponse<void>(r)
    ),
};
