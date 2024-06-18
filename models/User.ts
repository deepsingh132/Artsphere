import { UUID } from "crypto";
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

export type UserType = {
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
};

export const users = pgTable("users", {
  _id: uuid("_id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  image: text("image").default(
    "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
  ),
  bio: text("bio").default(
    "We don't know much about this user yet, but we are sure they are artistic!"
  ),
  followers: text("followers").array().default([]),
  following: text("following").array().default([]),
  verified: boolean("verified").default(false),
  role: text("role").default("user"),
  likes: uuid("likes").array().default([]),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});