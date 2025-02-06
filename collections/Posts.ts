import { RelationshipFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
  } from '@payloadcms/plugin-seo/fields'

  import {
    BlocksFeature,
    FixedToolbarFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    InlineToolbarFeature,
  } from '@payloadcms/richtext-lexical'

  export const Posts: CollectionConfig<'posts'> = {
    slug: 'posts',
    defaultPopulate: {
      title: true,
      slug: true,
      categories: true,
      meta: {
        image: true,
        description: true,
      },
    },
    admin: {
      defaultColumns: ['title', 'slug', 'updatedAt'],
      livePreview: {
        url: ({ data, req }) => {
          const path = generatePreviewPath({
            slug: typeof data?.slug === 'string' ? data.slug : '',
            collection: 'posts',
            req,
          })
  
          return path
        },
      },
      preview: (data, { req }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
          req,
        }),
      useAsTitle: 'title',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'slug',
        type: 'text',
        required: true,
        unique: true,
        admin: {
          position: 'sidebar',
        },
      },
      {
        type: 'tabs',
        tabs: [
          {
            fields: [
              {
                name: 'heroImage',
                type: 'upload',
                relationTo: 'media',
              },
              {
                name: 'content',
                type: 'richText',
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                      HorizontalRuleFeature(),
                    ]
                  },
                }),
                label: false,
                required: true,
              },
            ],
            label: 'Content',
          },
          {
            fields: [
              {
                name: 'relatedPosts',
                type: 'relationship',
                admin: {
                  position: 'sidebar',
                },
                filterOptions: ({ id }) => {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                },
                hasMany: true,
                relationTo: 'posts',
              },
            ],
            label: 'Meta',
          },
          {
            name: 'meta',
            label: 'SEO',
            fields: [
              OverviewField({
                titlePath: 'meta.title',
                descriptionPath: 'meta.description',
                imagePath: 'meta.image',
              }),
              MetaTitleField({
                hasGenerateFn: true,
              }),
              MetaImageField({
                relationTo: 'media',
              }),
  
              MetaDescriptionField({}),
              PreviewField({
                // if the `generateUrl` function is configured
                hasGenerateFn: true,
  
                // field paths to match the target field for data
                titlePath: 'meta.title',
                descriptionPath: 'meta.description',
              }),
            ],
          },
        ],
      },
      {
        name: 'publishedAt',
        type: 'date',
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
          },
          position: 'sidebar',
        },
        hooks: {
          beforeChange: [
            ({ siblingData, value }) => {
              if (siblingData._status === 'published' && !value) {
                return new Date()
              }
              return value
            },
          ],
        },
      },
      {
        name: 'authors',
        type: 'relationship',
        admin: {
          position: 'sidebar',
        },
        hasMany: true,
        relationTo: 'users',
      },
      // This field is only used to populate the user data via the `populateAuthors` hook
      // This is because the `user` collection has access control locked to protect user privacy
      // GraphQL will also not return mutated user data that differs from the underlying schema
      {
        name: 'populatedAuthors',
        type: 'array',
        access: {
          update: () => false,
        },
        admin: {
          disabled: true,
          readOnly: true,
        },
        fields: [
          {
            name: 'id',
            type: 'text',
          },
          {
            name: 'name',
            type: 'text',
          },
        ],
      },
    ],
    versions: {
      drafts: {
        autosave: {
          interval: 100, // We set this interval for optimal live preview
        },
        schedulePublish: true,
      },
      maxPerDoc: 50,
    },
    upload: {
        staticURL: '/media',
        staticDir: 'media',
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'card',
            width: 768,
            height: 1024,
            position: 'centre',
          },
          {
            name: 'feature',
            width: 1024,
            height: undefined,
            position: 'centre',
          },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'],
      },
  }