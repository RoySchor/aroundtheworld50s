"""Process management for blog operations."""
import subprocess
import sys
from pathlib import Path
import shutil

def run_lint_fix(base_dir):
    """Run npm run lint:fix to fix any linting issues."""
    print("\nRunning npm run lint:fix to fix any formatting issues...")
    try:
        subprocess.run(['npm', 'run', 'lint:fix'], cwd=base_dir, check=True)
        print("✅ Linting completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Warning: Linting failed with error: {e}")
        print("You may want to run 'npm run lint:fix' manually to fix any issues")

def run_npm_start(base_dir):
    """Run npm start in a new terminal window."""
    print("\nStarting the development server in a new window...")
    try:
        if sys.platform == "darwin":  # macOS
            # Create a shell script to run npm start
            script_path = base_dir / "start_dev_server.sh"
            with open(script_path, 'w') as f:
                f.write('#!/bin/bash\n')
                f.write(f'cd "{base_dir}"\n')
                f.write('npm start\n')
            # Make the script executable
            subprocess.run(['chmod', '+x', str(script_path)], check=True)
            # Open in new Terminal window
            subprocess.run(['open', '-a', 'Terminal', str(script_path)], check=True)
        elif sys.platform == "win32":  # Windows
            subprocess.run(['start', 'cmd', '/k', 'npm', 'start'], cwd=base_dir, check=True)
        else:  # Linux
            subprocess.run(['gnome-terminal', '--', 'npm', 'start'], cwd=base_dir, check=True)
        print("✅ Development server started in a new window!")
        print("Please check the new terminal window for the development server.")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Warning: Failed to start development server: {e}")
        print("You may need to start it manually with 'npm start' in a new terminal")

def kill_npm_process():
    """Kill any running npm start process."""
    try:
        if sys.platform == "darwin":  # macOS
            # Kill all node processes running npm start
            subprocess.run(['pkill', '-f', 'node.*npm start'], check=False)
            # Also kill any node processes that might be running the server
            subprocess.run(['pkill', '-f', 'node.*react-scripts start'], check=False)
        elif sys.platform == "win32":  # Windows
            # Kill all node processes
            subprocess.run(['taskkill', '/F', '/IM', 'node.exe'], check=False)
            subprocess.run(['taskkill', '/F', '/FI', 'WINDOWTITLE eq npm start'], check=False)
        else:  # Linux
            subprocess.run(['pkill', '-f', 'node.*npm start'], check=False)
            subprocess.run(['pkill', '-f', 'node.*react-scripts start'], check=False)
    except subprocess.CalledProcessError:
        pass  # Ignore errors if no process is running

def revert_changes(base_dir, assets_dir, blog_component_dir, blog_data, post_index):
    """Revert all changes made by the script."""
    print("\nReverting all changes...")

    # Kill npm start process
    kill_npm_process()

    try:
        # Get the current commit hash
        result = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=base_dir, capture_output=True, text=True, check=True)
        current_commit = result.stdout.strip()

        # Reset to the current commit, discarding all changes
        subprocess.run(['git', 'reset', '--hard', current_commit], cwd=base_dir, check=True)

        # Clean untracked files and directories
        subprocess.run(['git', 'clean', '-fd'], cwd=base_dir, check=True)

        print("✅ All changes have been reverted to the last commit and untracked files have been removed!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Error reverting changes: {e}")
        print("You may need to revert changes manually with:")
        print("1. git reset --hard HEAD")
        print("2. git clean -fd")

def deploy_changes(base_dir):
    """Commit, push, and deploy the changes."""
    print("\nDeploying changes...")
    try:
        # Commit changes
        subprocess.run(['git', 'add', '.'], cwd=base_dir, check=True)
        subprocess.run(['git', 'commit', '-m', 'Add new blog post'], cwd=base_dir, check=True)
        # Push changes
        subprocess.run(['git', 'push'], cwd=base_dir, check=True)
        # Deploy
        subprocess.run(['npm', 'run', 'deploy'], cwd=base_dir, check=True)
        print("✅ Changes have been deployed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Error during deployment: {e}")
        print("You may need to deploy manually")

def force_webpack_rebuild(base_dir):
    """Force webpack to rebuild by touching the webpack config."""
    webpack_config = base_dir / "node_modules/react-scripts/config/webpack.config.js"
    if webpack_config.exists():
        webpack_config.touch()

def clear_webpack_cache(base_dir):
    """Clear webpack cache to ensure fresh build."""
    cache_dir = base_dir / "node_modules/.cache"
    if cache_dir.exists():
        shutil.rmtree(cache_dir)