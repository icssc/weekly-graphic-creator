failed=0;

for fname in public/club-logos/*.png; do
    image=$(file $fname);
    if ! [[ "$image" =~ "PNG image data, 312 x 312" || "$image" =~ "PNG image data, 312 x 228" ]]; then
        echo "Image has wrong dimensions: $fname"
        failed=1;
    fi
done

exit $failed;
