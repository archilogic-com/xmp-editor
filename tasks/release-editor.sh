npm run build

# Clean S3 directory
aws s3 rm s3://project.archilogic.com/xmp-editor/ --recursive
# Upload all files
aws s3 sync dist/editor s3://project.archilogic.com/xmp-editor