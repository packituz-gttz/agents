#!/bin/bash

# Run ESLint and capture its output
eslint_output=$(npm run lint 2>&1)

# Extract the last mentioned file path from the ESLint output
last_file=$(echo "$eslint_output" | grep -oP '/home/danny/agentus/\K.*\.ts' | tail -n 1)

if [ -z "$last_file" ]; then
    echo "No TypeScript files with issues found in the ESLint output."
    exit 1
fi

echo "Analyzing file: $last_file"

# Run the ESM error checker on the last mentioned file
js_output=$(node esm-error-checker.mjs "$last_file")

# Print the output
echo -e "$js_output"

# Save the output to a file
echo -e "$js_output" > lint_output.txt
echo "Output saved to lint_output.txt"

# Try to copy to clipboard, if xclip is available
if command -v xclip > /dev/null; then
    echo -e "$js_output" | xclip -selection clipboard
    echo "Output copied to clipboard."
fi
