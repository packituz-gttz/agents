#!/bin/bash

# Run the lint command and save the output
lint_output=$(npm run lint 2>&1)

# Extract the latest file with issues
latest_file=$(echo "$lint_output" | grep -oP '(?<=/home/danny/agentus/src/).*\.ts' | tail -n 1)

if [ -z "$latest_file" ]; then
    echo "No files with issues found."
    exit 1
fi

full_path="/home/danny/agentus/src/$latest_file"

# Get the file content
file_content=$(cat "$full_path")

# Extract type errors for the file
type_errors=$(echo "$lint_output" | awk -v file="$full_path" '$0 ~ file {p=1} p; /^$/ {p=0}' | grep 'error')

# Determine the file extension for markdown code block
file_extension="${latest_file##*.}"

# Prepare the output
output="\`\`\`$file_extension\n$file_content\n\`\`\`\n\n// Type Errors:\n"

while IFS= read -r error; do
    line_num=$(echo "$error" | awk '{print $1}' | cut -d ':' -f 1)
    col_num=$(echo "$error" | awk '{print $1}' | cut -d ':' -f 2)
    error_message=$(echo "$error" | awk '{$1=""; print $0}' | sed 's/^  //')
    line_content=$(sed "${line_num}q;d" "$full_path")
    
    output+="Line $line_num, Column $col_num: $error_message\n"
    output+="\`\`\`$file_extension\n$line_content\n\`\`\`\n\n"
done <<< "$type_errors"

# Print the output
echo -e "$output"

# Try to copy to clipboard, if xclip is available
if command -v xclip > /dev/null; then
    echo -e "$output" | xclip -selection clipboard
    echo "Output copied to clipboard."
else
    # If xclip is not available, save to a file
    output_file="lint_output.txt"
    echo -e "$output" > "$output_file"
    echo "Output saved to $output_file"
fi
