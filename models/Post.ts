import { pgTable, uuid, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
// import jsonb from "@/@types/jsonb";
import { users } from "./User";
import { UUID } from "crypto";

export type PostType = {
  _id: string;
  likes: string[] | null;
  content: string | null;
  authorID: string;
  category: string | null;
  featured: boolean | null;
  comments: unknown[] | null;
  url: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

// Define the comment type
export interface CommentType {
  _id: UUID;
  userId: UUID;
  content: string;
  username: string;
  timestamp: Date;
  url: string;
  userImg: string;
  name: string;
}

export const posts = pgTable("posts", {
  _id: uuid("_id").defaultRandom().primaryKey(),
  content: text("content").default(""),
  authorID: uuid("authorID").notNull().references(() => users._id),
  category: text("category").default("other"),
  featured: boolean("featured").default(false),
  likes: uuid("likes").array().default([]),
  comments: jsonb("comments").array().default([]),
  url: text("url").default(""),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Post = typeof posts;