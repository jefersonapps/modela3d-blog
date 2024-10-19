import { db } from "./drizzle";
import { commentsTable, postsTable, usersTable } from "./schema";
import { desc, eq, or, sql, and, ilike } from "drizzle-orm";

interface Like {
  author_id: string;
  post_id: string;
}

interface Likes {
  likedByCurrentUser: boolean;
  likesCount: number;
}

export interface Post {
  authorId: string;
  content: string;
  author: string;
  slug: string;
  id?: string | null;
  createdAt?: Date | null;
  likes?: Likes;
  userImageUrl: string;
}

export interface UnauthenticatedPosts {
  id: string;
  authorId: string;
  content: string;
  author: string;
  slug: string;
  likes: Omit<Likes, "likedByCurrentUser">;
  userImageUrl: string;
  createdAt: Date;
}

export const createPost = async (post: Post) => {
  try {
    await db.insert(postsTable).values({
      content: post.content,
      author: post.author,
      author_id: post.authorId,
      slug: post.slug,
      likes: sql`'[]'::jsonb`,
      user_image_url: post.userImageUrl,
      created_at: sql`now()`,
    });
  } catch (err) {
    console.error("Error executing SQL query:", err);
    throw err;
  }
};

export const getPostsForUnauthenticatedUser = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const posts = await db
    .select({
      id: postsTable.id,
      authorId: postsTable.author_id,
      content: postsTable.content,
      author: postsTable.author,
      slug: postsTable.slug,
      likes: sql<Omit<Likes, "likedByCurrentUser">>/*sql*/ `
      JSON_BUILD_OBJECT(
        'likesCount', 
        (
          SELECT JSONB_ARRAY_LENGTH(${postsTable.likes})
        )
      )
    `,
      userImageUrl: postsTable.user_image_url,
      createdAt: postsTable.created_at,
    })
    .from(postsTable)
    .orderBy(desc(postsTable.created_at))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return posts;
};

export const getTotalOfPosts = async () => {
  const result = await db
    .select({
      count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
    })
    .from(postsTable);
  return result;
};

export const getAllPosts = async ({
  userId,
  page,
  pageSize,
  searchQuery = "",
}: {
  userId: string;
  page: number;
  pageSize: number;
  searchQuery?: string | null;
}) => {
  const postsQuery = db
    .select({
      id: postsTable.id,
      authorId: postsTable.author_id,
      content: postsTable.content,
      author: postsTable.author,
      slug: postsTable.slug,
      likes: sql<Likes>/*sql*/ `
        JSON_BUILD_OBJECT(
          'likedByCurrentUser', 
          (
            SELECT EXISTS(
              SELECT 1
              FROM JSONB_ARRAY_ELEMENTS(${postsTable.likes}) AS like_obj
              WHERE (like_obj->>'author_id') = ${userId}
            )
          ),
          'likesCount', 
          (
            SELECT JSONB_ARRAY_LENGTH(${postsTable.likes})
          )
        )
      `,
      userImageUrl: postsTable.user_image_url,
      createdAt: postsTable.created_at,
    })
    .from(postsTable)
    .orderBy(desc(postsTable.created_at))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  if (searchQuery) {
    postsQuery.where(
      sql`(${postsTable.content} ILIKE ${`%${searchQuery}%`} OR ${
        postsTable.author
      } ILIKE ${`%${searchQuery}%`})`
    );
  }

  const posts = await postsQuery;
  return posts;
};

export const getSinglePost = async (postId: string, userId: string) => {
  const post = await db
    .select({
      id: postsTable.id,
      authorId: postsTable.author_id,
      content: postsTable.content,
      author: postsTable.author,
      slug: postsTable.slug,
      likes: sql<Likes>/*sql*/ `
      JSON_BUILD_OBJECT(
        'likedByCurrentUser', 
        (
          SELECT EXISTS(
            SELECT 1
            FROM JSONB_ARRAY_ELEMENTS(${postsTable.likes}) AS like_obj
            WHERE (like_obj->>'author_id') = ${userId}
          )
        ),
        'likesCount', 
        (
          SELECT JSONB_ARRAY_LENGTH(${postsTable.likes})
        )
      )
    `,
      userImageUrl: postsTable.user_image_url,
      createdAt: postsTable.created_at,
    })
    .from(postsTable)
    .where(eq(postsTable.id, postId))
    .limit(1);

  return post;
};

export const getPostsOfUser = async ({
  userId,
  page,
  pageSize,
  searchQuery = "",
}: {
  userId: string;
  page: number;
  pageSize: number;
  searchQuery?: string | null;
}) => {
  const posts = await db
    .select({
      id: postsTable.id,
      authorId: postsTable.author_id,
      content: postsTable.content,
      author: postsTable.author,
      slug: postsTable.slug,
      likes: sql<Likes>/*sql*/ `
        JSON_BUILD_OBJECT(
          'likedByCurrentUser', 
          (
            SELECT EXISTS(
              SELECT 1
              FROM JSONB_ARRAY_ELEMENTS(${postsTable.likes}) AS like_obj
              WHERE (like_obj->>'author_id') = ${userId}
            )
          ),
          'likesCount', 
          (
            SELECT JSONB_ARRAY_LENGTH(${postsTable.likes})
          )
        )
      `,
      userImageUrl: postsTable.user_image_url,
      createdAt: postsTable.created_at,
    })
    .from(postsTable)
    .where(
      and(
        eq(postsTable.author_id, userId),
        or(
          ilike(postsTable.content, "%" + searchQuery + "%"),
          ilike(postsTable.author, "%" + searchQuery + "%")
        )
      )
    )
    .orderBy(desc(postsTable.created_at))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return posts;
};

export const getTotalOfUserPosts = async (userId: string) => {
  const result = await db
    .select({
      count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
    })
    .from(postsTable)
    .where(eq(postsTable.author_id, userId));
  return result;
};

export const deletePost = async (id: string) => {
  await db.delete(postsTable).where(eq(postsTable.id, id));
};

export const updatePost = async (content: string, id: string) => {
  await db
    .update(postsTable)
    .set({ content: content })
    .where(eq(postsTable.id, id));
};

export const toggleLikePost = async (postId: string, authorId: string) => {
  const post = await db.query.postsTable.findFirst({
    where: (post, { eq }) => eq(post.id, postId),
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const likeExists = post.likes.some(
    (like: Like) => like.author_id === authorId
  );

  if (likeExists) {
    const updatedLikes = post.likes.filter(
      (like: Like) => like.author_id !== authorId
    );

    await db
      .update(postsTable)
      .set({ likes: updatedLikes })
      .where(eq(postsTable.id, postId));
  } else {
    const updatedLikes = [
      ...post.likes,
      { author_id: authorId, post_id: postId },
    ];

    await db
      .update(postsTable)
      .set({ likes: updatedLikes })
      .where(eq(postsTable.id, postId));
  }

  return { message: "Like toggled successfully" };
};

export const createUser = async (userName: string, userId: string) => {
  try {
    const existingUser = await db
      .select({
        id: usersTable.user_id,
      })
      .from(usersTable)
      .where(eq(usersTable.user_id, userId))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("User already exists with this userId:", userId);
      return;
    }

    await db.insert(usersTable).values({
      user_name: userName,
      user_id: userId,
      created_at: sql`now()`,
    });

    console.log("User created successfully");
  } catch (err) {
    console.error("Error executing SQL query:", err);
    throw err;
  }
};

export const getUser = async (userId: string) => {
  const user = await db
    .select({
      id: usersTable.id,
      userName: usersTable.user_name,
    })
    .from(usersTable)
    .where(eq(usersTable.user_id, userId))
    .limit(1);

  return user;
};

export const updateUser = async (userId: string, userName: string) => {
  await db
    .update(usersTable)
    .set({ user_name: userName })
    .where(eq(usersTable.user_id, userId));
};

export interface Comment {
  id?: string;
  postId: string;
  parentCommentId: string | null;
  parentCommentAuthor: string | null;
  parentCommentAuthorId: string | null;
  content: string;
  author: string;
  authorId: string;
  userImageUrl: string;
  likes?: Likes;
  createdAt?: Date;
}

export const createComment = async (comment: Comment) => {
  try {
    await db.insert(commentsTable).values({
      author: comment.author,
      author_id: comment.authorId,
      content: comment.content,
      post_id: comment.postId,
      parent_comment_id: comment.parentCommentId || null,
      parent_comment_author: comment.parentCommentAuthor || null,
      parent_comment_author_id: comment.parentCommentAuthorId || null,
      user_image_url: comment.userImageUrl,
      likes: sql`'[]'::jsonb`,
      created_at: sql`now()`,
    });
  } catch (error) {
    throw error;
  }
};

export const getCommentsByPostId = async (postId: string, userId: string) => {
  const comments = await db
    .select({
      id: commentsTable.id,
      postId: commentsTable.post_id,
      parentCommentId: commentsTable.parent_comment_id,
      parentCommentAuthor: commentsTable.parent_comment_author,
      parentCommentAuthorId: commentsTable.parent_comment_author_id,
      content: commentsTable.content,
      author: commentsTable.author,
      authorId: commentsTable.author_id,
      userImageUrl: commentsTable.user_image_url,
      likes: sql<Like[]>/*sql*/ `
        JSON_BUILD_OBJECT(
          'likedByCurrentUser', 
          (
            SELECT EXISTS(
              SELECT 1
              FROM JSONB_ARRAY_ELEMENTS(${commentsTable.likes}) AS like_obj
              WHERE (like_obj->>'author_id') = ${userId}
            )
          ),
          'likesCount', 
          (
            SELECT JSONB_ARRAY_LENGTH(${commentsTable.likes})
          )
        )
      `,
      createdAt: commentsTable.created_at,
    })
    .from(commentsTable)
    .where(eq(commentsTable.post_id, postId))
    .orderBy(desc(commentsTable.created_at))
    .limit(10);

  return comments;
};

export const toggleLikeComment = async (
  commentId: string,
  authorId: string
) => {
  const comment = await db.query.commentsTable.findFirst({
    where: (comment, { eq }) => eq(comment.id, commentId),
  });

  if (!comment) {
    throw new Error("comment not found");
  }

  const likeExists = comment.likes.some((like) => like.author_id === authorId);

  if (likeExists) {
    const updatedLikes = comment.likes.filter(
      (like) => like.author_id !== authorId
    );

    await db
      .update(commentsTable)
      .set({ likes: updatedLikes })
      .where(eq(commentsTable.id, commentId));
  } else {
    const updatedLikes = [
      ...comment.likes,
      { author_id: authorId, comment_id: commentId },
    ];

    await db
      .update(commentsTable)
      .set({ likes: updatedLikes })
      .where(eq(commentsTable.id, commentId));
  }

  return { message: "Like toggled successfully" };
};

export const deleteComment = async (commentId: string) => {
  await db.delete(commentsTable).where(eq(commentsTable.id, commentId));
};

export const updateComment = async (commentId: string, content: string) => {
  await db
    .update(commentsTable)
    .set({ content: content })
    .where(eq(commentsTable.id, commentId));
};
