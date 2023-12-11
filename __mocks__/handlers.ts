import { http, HttpResponse } from 'msw'
import { backendUrl } from '@/app/utils/config/backendUrl';

export const handlers = [
  http.get(`${backendUrl}/posts`, () => {
    return HttpResponse.json({
      posts: [
        // without any media
        {
          _id: 1,
          userImg: "https://picsum.photos/200",
          name: "John Doe",
          username: "johndoe132",
          authorID: "12345",
          likes: [],
          comments: [],
          content: "Example post without media",
          createdAt: "2021-01-01T00:00:00.000Z",
          updatedAt: "2021-01-01T00:00:00.000Z",
        },
        // with media
        {
          _id: 2,
          userImg: "https://picsum.photos/200",
          name: "Jane Doe",
          username: "janedoe132",
          authorID: "9876",
          likes: [],
          comments: [],
          content: "Example post with media",
          url: "https://picsum.photos/200",
          createdAt: "2021-01-01T00:00:00.000Z",
          updatedAt: "2021-01-01T00:00:00.000Z",
        },
        // with youtube embed
        {
          _id: 3,
          userImg: "https://picsum.photos/200",
          name: "Jane Doe",
          username: "janedoe132",
          authorID: "9876",
          likes: [],
          comments: [],
          content: "Example post with youtube embed",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          createdAt: "2021-01-01T00:00:00.000Z",
          updatedAt: "2021-01-01T00:00:00.000Z",
        },
      ],
    });
  }),

  // For post with id 1
  http.get(`${backendUrl}/posts/1`, () => {
    return HttpResponse.json({
      post: {
        _id: 1,
        userImg: "https://picsum.photos/200",
        name: "John Doe",
        username: "johndoe132",
        authorID: "12345",
        content: "Lorem ipsum dolor sit amet",
        createdAt: "2021-01-01T00:00:00.000Z",
        updatedAt: "2021-01-01T00:00:00.000Z",
      },
    });
  }),

  // For posts by any id
  http.get(`${backendUrl}/posts/:id`, () => {
    return HttpResponse.json({
      post: {
        _id: 1,
        userImg: "https://picsum.photos/200",
        name: "John Doe",
        username: "johndoe132",
        authorID: "12345",
        content: "Lorem ipsum dolor sit amet",
        createdAt: "2021-01-01T00:00:00.000Z",
        updatedAt: "2021-01-01T00:00:00.000Z",
      },
    });
  }),

  http.post(`${backendUrl}/posts`, () => {
    return HttpResponse.json({
      message: "Post created successfully!",
      status: 200,
    });
  }),

  // Handles a DELETE /api/posts/:id request
  http.delete(`${backendUrl}/posts/:id`, () => {
    return HttpResponse.json({
      message: "Post deleted",
      status: 200,
    });
  }),

  // For adding a comment
  http.put(`${backendUrl}/posts/1/comment`, () => {
    return HttpResponse.json({
      message: "Comment added successfully!",
      status: 200,
    });
  }),

  http.get(`${backendUrl}/widgets/trending/posts`, () => {
    return HttpResponse.json({
      trendingPosts: [
        {
          _id: "60e4c9d5f4d9e3b9a8c0f1b8",
          content: "This is a test post",
          name: "Test User",
          email: "testuser@email.com",
          url: "https://example.com/image.jpg",
          category: "Art",
          likes: [],
          comments: [],
          createdAt: "2021-07-07T15:47:17.000Z",
          updatedAt: "2021-07-07T15:47:17.000Z",
          __v: 0,
        },
        {
          _id: 2,
          userImg: "https://picsum.photos/200",
          name: "Jane Doe",
          username: "janedoe132",
          authorID: "9876",
          content: "Lorem ipsum dolor sit amet",
          url: "https://picsum.photos/200",
          createdAt: "2021-01-01T00:00:00.000Z",
          updatedAt: "2021-01-01T00:00:00.000Z",
        },
      ],
    });
  }),

  http.put(`${backendUrl}/posts/1/like`, () => {
    return HttpResponse.json({
      message: "Like updated successfully!",
      status: 200,
    });
  }),

  http.delete(`${backendUrl}/posts/1`, () => {
    return HttpResponse.json({
      message: "Post deleted",
      status: 200,
    });
  }),

  // fail the request and return a 500 status code to test the error handling
  http.get("undefined/posts", () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }),

  http.get("https://randomuser.me/api/", () => {
    return HttpResponse.json({
      results: [
        {
          name: {
            first: "John",
            last: "Doe",
          },
          login: {
            username: "johndoe123",
          },
          picture: {
            thumbnail: "https://picsum.photos/200",
          },
        },
        {
          name: {
            first: "Jane",
            last: "Doe",
          },
          login: {
            username: "janedoe123",
          },
          picture: {
            thumbnail: "https://picsum.photos/200",
          },
        },
      ],
    });
  }),
];
