rm -R public/*
hugo --minify
hugo deploy --maxDeletes -1 --invalidateCDN