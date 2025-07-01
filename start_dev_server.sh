#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the script's directory (which is the project root)
cd "$SCRIPT_DIR"

# Start the development server
npm start
