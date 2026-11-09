# Local blog content

The blog reads `index.json` and the matching `<slug>.html` files from this directory. Images are stored in `public/blog/`. Neither blog route needs Payload, Postgres, or a remote media service.

## Edit a post

1. Edit its HTML file. Keep semantic HTML and use local `/blog/<filename>` paths for images.
2. Update its title or description in `index.json` as needed.
3. Keep its slug unchanged to preserve existing links.

## Add a post

1. Create `<slug>.html` containing the article body (the page adds the title).
2. Add an entry to `index.json` with `slug`, `title`, `description`, and `source`. Use an empty source for new posts. Entries appear in index order.
3. Put images in `public/blog/` and reference them from the HTML.
4. Run `node --test tests/blog.test.mjs`.

Only repository-owned, reviewed HTML belongs here. It is rendered directly, not sanitized at runtime. Do not add scripts, inline event handlers, or untrusted HTML.

## Recovery provenance

The 10 articles listed on https://www.jasgarcha.com/blog were recovered from their published HTML on 2026-11-08. Their existing slugs, order, titles, descriptions, body markup, and links were retained. All 68 referenced image files (including responsive variants) were recovered from the existing Vercel Blob store and copied locally. CMS image URLs were rewritten to local paths.

This recovers the published site, not a complete database export. Drafts, revision history, unpublished posts, and CMS-only metadata were not available from the public pages. The old Payload admin/API routes and database configuration have been removed.

## Formatting

Run `yarn format:blog` after importing HTML. It normalizes heading levels, nests sublists under their parent items, converts code-only paragraphs to keyboard-scrollable code blocks, and adds lazy image loading. The formatter checks that article text is unchanged and can be run repeatedly. Use `node scripts/format-blog.mjs --check` to validate without writing files. Shared typography is in `app/blog/globals.css`.
