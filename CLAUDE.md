# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog and portfolio website built with Hugo static site generator, deployed to AWS S3 with CloudFront CDN for global distribution. The site uses a forked Hugo theme (hello-friend-ng) with extensive custom styling modifications.

## Development Commands

### Local Development
```bash
# Run local dev server (serves on http://localhost:1313)
./scripts/run_local.sh
# Or directly:
hugo server start -D
```

### Building and Deployment
```bash
# Standard deployment (cleans public/, builds, deploys to S3, invalidates CloudFront)
./scripts/deploy.sh

# Force deployment (bypasses caching checks)
./scripts/force_deploy.sh

# Manual build only
hugo
```

### Content Creation
```bash
# Create new blog post (uses archetype from archetypes/posts.md)
hugo new content/posts/post-name.md

# Posts are created as drafts by default. Remove 'draft: true' before publishing.
```

## Architecture

### Hugo Theme Customization
The site uses a **forked git submodule** of the hello-friend-ng theme located at `themes/hello-friend-ng`. Theme customizations are made directly in the fork:
- Custom color scheme in `themes/hello-friend-ng/assets/scss/_variables.scss`
- Light theme: Custom blue backgrounds, green accents
- Dark theme: Navy backgrounds, emerald green links (`#04885e`)
- Logo cursor color: `#059669`

**Important**: CSS/SCSS changes should be made in the theme submodule, NOT in the main repo. After theme changes:
```bash
cd themes/hello-friend-ng
git add . && git commit -m "Update theme"
git push
cd ../..
git add themes/hello-friend-ng
git commit -m "Use new theme with [description]"
```

### Layout Override Structure
Hugo layout precedence: layouts in root override theme layouts
- `layouts/index.html` - Homepage with portrait and social icons
- `layouts/partials/` - Custom partials (head, logo, footer, etc.)
- `layouts/shortcodes/` - Custom shortcodes (image positioning, rawhtml)
- `layouts/posts/` - Post-specific templates

### AWS Infrastructure
- **S3 Bucket**: `staticsitebucket-austinatchleyaws` (us-west-2)
- **CloudFront Distribution**: `EPBD5YIHCM3QO`
- **Lambda@Edge**: `lambda/index.js` - URL rewriting function that appends `/index.html` to directory paths for clean URLs
- **Deployment**: Uses Hugo's built-in S3 deployment with automatic CloudFront invalidation

### Content Organization
```
content/
  ├── about.md          # Professional bio
  ├── projects.md       # Portfolio and project showcase
  └── posts/            # Blog posts (18 posts on tech, travel, philosophy)
      └── *.md
```

All blog content is markdown with front matter. Images referenced from `/static/images/`.

## Configuration Notes

### config.toml Key Settings
- **Permalinks**: `/posts/:year/:month/:title/`
- **Pagination**: 15 items per page
- **Syntax highlighting**: Monokai style with PygmentsCodeFences
- **Theme toggle**: Enabled, defaults to dark mode
- **Logo text**: `"$ cd /home/austin"` with `>` mark
- **Custom menu**: Posts, Projects, About

### Deployment Configuration
Located in `config.toml` under `[deployment]`:
- Cache control: 1 year for static assets (JS/CSS/SVG/TTF/images)
- Gzip compression for HTML/XML/JSON/CSS/JS
- CloudFront invalidation on deploy

## Development Workflow

### Typical Content Update Flow
1. Create or edit markdown in `content/posts/`
2. Test locally with `./scripts/run_local.sh`
3. Verify rendering, images, and links
4. Deploy with `./scripts/deploy.sh`

### Theme Modification Flow
1. Make changes in `themes/hello-friend-ng/` submodule
2. Commit and push theme changes
3. Update submodule reference in main repo
4. Test locally before deploying

### Recent Git History Patterns
Common commit messages indicate typical workflows:
- "Use new theme with [feature]" - Theme submodule updates
- "Update styling" - Visual/CSS adjustments
- "Add [topic] post" - New blog content
- "Appease the markdown linter" - Formatting fixes

## Requirements

- **Hugo**: v0.152.2+extended+withdeploy or later (extended version required for SCSS compilation)
- **AWS CLI**: Configured with credentials for S3/CloudFront access
- **Git**: For submodule management

## Custom Shortcodes

### image
Positions images in posts:
```markdown
{{< image src="/images/photo.jpg" alt="Description" position="center" >}}
```

### rawhtml
Embeds raw HTML in markdown when needed.

### heading
Custom heading rendering (details in `layouts/shortcodes/heading.html`)

## Content Guidelines

Posts use front matter with:
- `title` - Post title
- `date` - Publication date (format: "2025-02-09")
- `draft` - Set to false or remove before publishing
- `tags` - Optional taxonomy tags
- `toc` - Optional table of contents (default: false)

Images stored in `/static/images/` and referenced as `/images/filename.jpg` in markdown.
