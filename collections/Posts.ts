import { RelationshipFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
        name: 'feature_image',
        type: 'relationship',
        relationTo: 'media',
    },
    {
        name: 'body',
        type: 'richText',
        editor: lexicalEditor({}),
        required: true
    },

  ]
}
