#!/bin/bash
# lint_analyzer.sh

echo "Script started"

# Run the lint command and save the output
lint_output=$(npm run lint 2>&1)

echo "Lint command executed"
echo "Lint output (first 5 lines):"
echo "$lint_output" | head -n 5

# Extract the latest file with issues
latest_file=$(echo "$lint_output" | grep -oP '(?<=/home/danny/agentus/src/).*\.ts' | tail -n 1)

echo "Latest file: $latest_file"

if [ -z "$latest_file" ]; then
    echo "No files with issues found."
    exit 1
fi

full_path="/home/danny/agentus/src/$latest_file"

echo "Full path: $full_path"

# Get the file content
file_content=$(cat "$full_path")

echo "File content retrieved (first 5 lines):"
echo "$file_content" | head -n 5

# Extract type errors for the file
type_errors=$(echo "$lint_output" | awk -v file="$full_path" '$0 ~ file {p=1} p; /^$/ {p=0}' | grep 'error')

echo "Type errors extracted"
echo "Type errors (first 5 lines):"
echo "$type_errors" | head -n 5

echo "Script completed"
