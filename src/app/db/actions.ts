import { db } from "./drizzle";
import { postsTable, usersTable } from "./schema";
import { desc, eq, sql } from "drizzle-orm";

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

export const getSinglePost = async (slug: string) => {
  return await db.query.postsTable.findFirst({
    where: (post, { eq }) => eq(post.slug, slug),
  });
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

export const toggleLike = async (postId: string, authorId: string) => {
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
