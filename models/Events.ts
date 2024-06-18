import { UUID } from "crypto";
import { pgTable, uuid, text, timestamp, boolean, date, integer } from "drizzle-orm/pg-core";
import jsonb from "@/@types/jsonb";
import { users } from "./User";

export type EventType = {
  _id: UUID;
  title: string;
  description: string;
  image: string;
  date: Date;
  location: string;
  token: string;
  verified: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  link: string;
  organizer: UUID;
  attendees: {
    userId: UUID;
    code: string;
  }[];
  attendeesCount: number;
  createdAt: Date;
  updatedAt: Date;
};

// Define the Attendee type
export interface Attendees {
  userId: string; // UUID of the user
  code: string;
}[];

// Define the Event table schema
export const events = pgTable('events', {
  _id: uuid('_id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  image: text('image').default(
    'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ),
  date: date('date').notNull(),
  location: text('location').notNull(),
  token: text('token').notNull(),
  verified: boolean('verified').default(false),
  coordinates: jsonb('coordinates').default({ lat: 0, lng: 0 }).notNull(),
  link: text('link'),
  organizer: uuid('organizer').notNull().references(() => users._id, { onDelete: 'cascade' }),
  attendees: jsonb('attendees')
    .default([{ userId: '', code: '' }]),
  attendeesCount: integer('attendeesCount').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
});
