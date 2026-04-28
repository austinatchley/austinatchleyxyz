rm -R public/*
hugo --minify
hugo deploy --force --maxDeletes -1 --invalidateCDN