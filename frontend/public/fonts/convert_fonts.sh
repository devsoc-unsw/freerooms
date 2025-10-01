#script to convert ttf files to woff2

FONT_DIR="TT Commons Pro Trial 3-400"

cd "$FONT_DIR" || exit 1

for file in *.ttf
do
    base=$(basename "$file" .ttf)
    echo "Processing: $file => $base.woff2"

    woff2_compress "$file"

    if [ -f "$base.woff2" ]; then
        echo "Created: $base.woff2"
    else
        echo "Output file not found: $base.woff2"
    fi
done

echo "Finished"