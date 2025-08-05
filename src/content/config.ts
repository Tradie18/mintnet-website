// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string(),
    description: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  legal: legalCollection,
};