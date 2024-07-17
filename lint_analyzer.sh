#!/bin/bash

# Run the ESM error checker
js_output=$(node esm-error-checker.mjs src/stream.ts)

# Print the output
echo -e "$js_output"

# Try to copy to clipboard, if xclip is available
if command -v xclip > /dev/null; then
    echo -e "$js_output" | xclip -selection clipboard
    echo "Output copied to clipboard."
else
    echo "Output saved to ts_error_output.txt"
fi
