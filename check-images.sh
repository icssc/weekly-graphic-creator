failed=0;

for file in public/club-logos/*.png; do
    image=$(file $file);
    if ! [[ "$image" =~ "PNG image data, 312 x 312" || "$image" =~ "PNG image data, 312 x 228" ]]; then
        echo "Image has wrong dimensions: $file"
        failed=1;
    fi
done

exit $failed;
