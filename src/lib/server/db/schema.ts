import { pgTable, pgEnum, uuid, text, boolean, integer, date, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const statusEnum = pgEnum('status', ['ongoing', 'completed']);
export const visibilityEnum = pgEnum('visibility', ['public', 'hidden']);
export const locationTypeEnum = pgEnum('location_type', ['remote', 'onsite', 'hybrid']);

// Tags (shared by projects & certificates)
export const tags = pgTable('tags', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull().unique(),
	color: text('color').notNull(), // hex, e.g. #8B7355
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Projects
export const projects = pgTable('projects', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	problemSolved: text('problem_solved'),
	status: statusEnum('status').notNull().default('ongoing'),
	role: text('role').array().notNull(),
	previewImage: text('preview_image'),
	githubUrl: text('github_url'),
	webUrl: text('web_url'),
	githubVisibility: visibilityEnum('github_visibility').notNull().default('public'),
	webVisibility: visibilityEnum('web_visibility').notNull().default('public'),
	isFeatured: boolean('is_featured').notNull().default(false), // manually pick which projects show on Home
	sortOrder: integer('sort_order').notNull().default(0), // for manual drag-reorder
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Junction: projects <-> tags
export const projectTags = pgTable(
	'project_tags',
	{
		projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
		tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
	},
	(t) => [
		primaryKey({ columns: [t.projectId, t.tagId] }),
	]
);

// Certificates
export const certificates = pgTable('certificates', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	date: date('date').notNull(),
	previewImage: text('preview_image'),
	isWinner: boolean('is_winner').notNull().default(false), // for the 🏆 badge
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Junction: certificates <-> tags
export const certificateTags = pgTable(
	'certificate_tags',
	{
		certificateId: uuid('certificate_id').notNull().references(() => certificates.id, { onDelete: 'cascade' }),
		tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
	},
	(t) => [
		primaryKey({ columns: [t.certificateId, t.tagId] }),
	]
);

// Experiences (work/freelance + organizations)
export const experiences = pgTable('experiences', {
	id: uuid('id').defaultRandom().primaryKey(),
	orgName: text('org_name').notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date'), // null = still ongoing
	points: text('points').array().notNull(), // "action + result" bullet points
	locationType: locationTypeEnum('location_type').notNull(),
	logoUrl: text('logo_url'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const tagsRelations = relations(tags, ({ many }) => ({
	projectTags: many(projectTags),
	certificateTags: many(certificateTags),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
	projectTags: many(projectTags),
}));

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
	project: one(projects, { fields: [projectTags.projectId], references: [projects.id] }),
	tag: one(tags, { fields: [projectTags.tagId], references: [tags.id] }),
}));

export const certificatesRelations = relations(certificates, ({ many }) => ({
	certificateTags: many(certificateTags),
}));

export const certificateTagsRelations = relations(certificateTags, ({ one }) => ({
	certificate: one(certificates, { fields: [certificateTags.certificateId], references: [certificates.id] }),
	tag: one(tags, { fields: [certificateTags.tagId], references: [tags.id] }),
}));