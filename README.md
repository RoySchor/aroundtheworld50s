# Around The World 50s 🌎✈️

[![Website](https://img.shields.io/website?url=https%3A%2F%2Froyschor.github.io%2Faroundtheworld50s)](https://royschor.github.io/aroundtheworld50s)

> A mother's journey around the world, made possible through automated blogging magic ✨

## 📖 Overview

This is not just another travel blog - it's a love letter to technology making content creation accessible to everyone. Built specifically for my mother who loves to share her adventures but isn't familiar with coding, this platform transforms the complex world of web development into a single, simple command.

### 🎯 Key Features

- **One-Command Blog Publishing**: Transform a folder of content into a beautiful blog post with a single command
- **Automated Code Generation**: Automatically creates React components, directories, and all necessary code
- **Built-in Preview System**: Test your blog post in a development environment before publishing
- **Git Integration**: Handles all version control automatically
- **Code Quality Assurance**: Automatic code formatting and linting

## 🚀 The Magic Behind the Scenes (ADMIN PAGE)
Login for the Admin page is behind a hashed password to prevent open access to blog generation and website editing.
<img width="498" alt="image" src="https://github.com/user-attachments/assets/e40ebe86-bb4f-436f-9d90-a16bf1ba7bed" />

In the blog generation we have a preview of the blog:
<img width="1155" alt="image" src="https://github.com/user-attachments/assets/81cb66e4-5dda-4f9f-a8ac-da6931a211d9" />

with the ability to add any type of content section customizable to the tee:
<img width="752" alt="image" src="https://github.com/user-attachments/assets/9ccd76b8-1833-4aa0-80ff-d6ee5b0dc6fd" />

The home page gallery can be changed and updated by my mother with changes handled automatically:
<img width="1072" alt="image" src="https://github.com/user-attachments/assets/00a8468b-cb71-419f-bff0-4c917d20a4a7" />

Preview for the gallery shows the exact changes she will make:
<img width="821" alt="image" src="https://github.com/user-attachments/assets/a0282450-fb82-4cad-8327-ea1a2ef8ede2" />

She can even edit the blogs associated tips section:
<img width="864" alt="image" src="https://github.com/user-attachments/assets/dfc5f38e-338f-440c-a4c0-a91eb821e58c" />

She edits it in Markdown the friendliest coding language and I convert that markdown into HTML with a preview of exactly how it will look:
<img width="863" alt="image" src="https://github.com/user-attachments/assets/7d82209e-0e65-4043-b479-5969634cca42" />


### How It Works

1. **Simple Content Preparation**
   - Create a folder on the Desktop with your blog content
   - Include your photos, text, and any other media

2. **One Command Does It All**
   ```bash
   python3 -m scripts.blog_management.blog_manager
   ```

3. **Automated Magic** ✨
   - ✅ Creates necessary directories
   - ✅ Generates React components
   - ✅ Sets up routing
   - ✅ Handles image processing
   - ✅ Updates navigation
   - ✅ Manages dependencies


4. **Preview & Quality Assurance**
   - 🔍 Automatically launches a development server
   - 👀 Preview your blog post exactly as it will appear
   - 🎨 Runs code formatting (ESLint)
   - ⚡ Tests in a staging-like environment

5. **Simple Publishing Flow**
   - ✅ Confirm changes: Automatically commits and deploys
   - ❌ Not happy? One click to revert all changes

## 🛠️ Behind the Scenes

The system handles all the complex tasks automatically:

```mermaid
graph TD
    A[Desktop Blog Folder] -->|Single Command| B[Blog Manager Script]
    B --> C[Generate Code]
    B --> D[Create Directories]
    B --> E[Process Images]
    C --> F[Preview Server]
    D --> F
    E --> F
    F -->|Approve| G[Deploy to Production]
    F -->|Reject| H[Revert Changes]
```

## 📚 For Developers

Interested in the technical details? Check out these specific READMEs:
- [Blog Management System](./scripts/blog_management/README.md)
- [Gallery Management](./scripts/gallery_management/README.md)
- [Tips Management](./scripts/tips_management/README.md)

## 🌟 The Result

A beautiful, professional travel blog that anyone can update - no coding required!

---

Built with ❤️ for my mother, making her travel stories accessible to the world.
