# Jasdeep Garcha's personal site

Next.js, React, Tailwind CSS, and D3, deployed on Vercel. Blog articles and images are checked into Git; there is no CMS or database dependency.

## Local development

Keep this checkout at `~/workspace/personal-site-next`, outside Dropbox. The original Dropbox checkout is retained as a backup; do not continue editing both copies.

Use Node.js 24 and Yarn 1.22.22:

```sh
npm install --global yarn@1.22.22
yarn install --frozen-lockfile
yarn dev
```

No secrets are required to build the site. Homepage feature flags have safe local defaults. To evaluate the project's live flags locally, link the existing Vercel project and run `vercel env pull`. Never commit the resulting environment file.

## Checks

```sh
yarn lint
yarn typecheck
yarn test
yarn build
yarn smoke
```

The smoke check starts and stops its own production server after a build. It checks the homepage, every blog post, SEO endpoints, social image, and removal of old CMS routes. GitHub Actions runs these checks on pull requests and pushes to `main`, without CMS/database credentials.

Yarn is the primary package manager and Vercel's existing install path. The pnpm lockfile is retained and synchronized for compatibility; regenerate both lockfiles when dependencies change. Do not restore the old Dropbox conflicted lockfile.

## Content

See [content/blog/README.md](content/blog/README.md). The post index controls order; adding or removing posts or images does not require changing test counts.

The old Payload admin, API, database configuration, generated types, demo dashboard, and unused CMS rendering components are removed. Remote storage and old environment variables have not been deleted, preserving backups.

## SEO and machine-readable discovery

- Production canonicals use `https://www.jasgarcha.com`, including in previews.
- Each page has a title, description, authorship, and social preview metadata.
- Person, WebSite, and BlogPosting JSON-LD describe only supported facts.
- `/sitemap.xml` lists the homepage, blog index, and every published post.
- `/robots.txt` advertises the sitemap; `/llms.txt` is an optional plain-text content index.
- `/opengraph-image` supplies a local social preview image.
- Article publication dates are omitted because the recovered source did not supply trustworthy dates. Add real dates to the content model before publishing date markup.

These measures improve crawlability and make the content easier to interpret; they do not guarantee search rankings, rich results, or inclusion in AI answers. Submit the production sitemap in your verified search-engine webmaster accounts after deployment.
