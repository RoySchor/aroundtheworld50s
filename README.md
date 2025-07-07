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

## 🤖 Automation Magic

The heart of this platform is its powerful automation script that handles everything from file processing to deployment:

### ⚠️ Important Note
All commands must be run from the project root directory. Before running any command, make sure you're in the correct directory:
```bash
cd path/to/around-the-world-50s
```

### Features
1. **Content Processing**
   - Downloads and organizes necessary files
   - Parses content and metadata
   - Creates required directories
   - Generates React components automatically

2. **Development & Preview**
   - Launches development server
   - Opens preview in browser automatically
   - Provides real-time feedback

3. **Quality & Deployment**
   - Runs ESLint for code formatting
   - Validates all changes
   - Handles Git operations
   - Deploys to production or reverts changes based on approval

All of this happens automatically with a single command:
```bash
python3 -m scripts.blog_management.blog_manager
```

## 🎨 Admin Interface

The admin interface provides a secure, user-friendly way to manage all aspects of the blog.

<table>
<tr>
<td width="50%">

### Secure Access
Protected admin interface with hashed password authentication:

<img width="498" alt="Admin Login" src="https://github.com/user-attachments/assets/e40ebe86-bb4f-436f-9d90-a16bf1ba7bed" />
</td>
</tr>
</table>

### Content Management

<table>
<tr>
<td width="50%">

### Blog Preview
Real-time preview of blog posts as you create them:

<img width="498" alt="Blog Preview" src="https://github.com/user-attachments/assets/81cb66e4-5dda-4f9f-a8ac-da6931a211d9" />
</td>
<td width="50%">

#### Flexible Content Sections
Add any type of content with full customization:

<img width="498" alt="Content Sections" src="https://github.com/user-attachments/assets/9ccd76b8-1833-4aa0-80ff-d6ee5b0dc6fd" />
</td>
</tr>
</table>

### Preview System

<table>
<tr>
<td width="50%">

#### Gallery Management
Update the home page gallery with live preview:

<img width="498" alt="Gallery Management" src="https://github.com/user-attachments/assets/00a8468b-cb71-419f-bff0-4c917d20a4a7" />
</td>
<td width="50%">

#### Gallery Preview
See exactly how your gallery changes will look:

<img width="628" alt="image" src="https://github.com/user-attachments/assets/70a77b67-363e-4ddd-89de-c70cf2b5fb52" />
</td>
</tr>
</table>

<table>
<tr>
<td width="50%">

#### Tips Section
Edit travel tips with ease:

<img width="498" alt="Tips Editor" src="https://github.com/user-attachments/assets/dfc5f38e-338f-440c-a4c0-a91eb821e58c" />
</td>
<td width="50%">

### Markdown Support
Write content in user-friendly Markdown with live HTML preview:

<img width="863" alt="Markdown Preview" src="https://github.com/user-attachments/assets/7d82209e-0e65-4043-b479-5969634cca42" />
</td>
</tr>
</table>



## 🛠️ Technical Flow

```mermaid
graph TD
    A[Admin Blog Generator Page] -->|Create Blog via Form Inputs| B[Generate Blog Button]
    B[Generate Blog Button] -->|Single Command| C[Blog Manager Script]
    C --> D[Generate Code]
    C --> E[Create Directories]
    C --> F[Process Images]
    D --> G[Run ESlint Code Formatting]
    G --> H[Preview Server]
    E --> G
    F --> G
    H -->|Approve| I[Commit & Push then Deploy to Production]
    H -->|Reject| J[Revert Changes to Previous Commit]
```

## 📚 For Developers

Interested in the technical details? Check out these specific READMEs:
- [Blog Management System](./scripts/blog_management/README.md)
- [Gallery Management](./scripts/gallery_management/README.md)
- [Tips Management](./scripts/tips_management/README.md)

---

Built with ❤️ for my mother, making her travel stories accessible to the world.
