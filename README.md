# Aroundtheworld50s blogging website

A website of adventures, exploration, and life for my mother :)

[aroundtheworld50s.com](https://royschor.github.io/aroundtheworld50s)
## 🚧 Work in Progress

### Overview
This website is being developed for my mother, who has limited experience with coding. The core idea is to simplify the blog publishing process down to a single script:
```
python3 -m scripts.blog_management.blog_manager
```
#### How It Works
1. **Prompt for Blog Folder Name**

   The script prompts the user to enter the name of a folder containing the blog files. This folder must be located on the Desktop, as that’s where the script requests access and searches by default.
2. **Automated Setup**

   Once a folder is selected, the script:
   - Verifies necessary components exist
   - Parses the blog content
   - Generates the necessary React components
   - Applies the required changes across the codebase

3. **Preview in Development**
  
   The script launches a development server in a new terminal window via:
   ```
   npm run start
   ```
    This allows the user to preview the new blog post.

4. **User Confirmation**
  
   After reviewing the preview, the user is prompted to either:
   - Confirm the changes:
       - Changes are committed
       - Pushed to GitHub
       - Deployed to production via GitHub Actions using:
       ```
       npm run deploy
       ```
   - Revert the changes:
       - The working directory is reset to the latest commit
       - All untracked files are discarded


5. **The development server is stopped**
