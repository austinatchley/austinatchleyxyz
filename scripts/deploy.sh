BUCKET_NAME="staticsitebucket-austinatchleyaws"

rm -R public/*
hugo

aws s3 rm s3://$BUCKET_NAME --recursive
aws s3 cp public s3://$BUCKET_NAME/ --recursive
