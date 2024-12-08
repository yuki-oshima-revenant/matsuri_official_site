#/bin/bash

npm run build
aws s3 rm s3://matsuri.unronritaro.net/ --recursive --profile hobby
aws s3 cp ./dist s3://matsuri.unronritaro.net/ --recursive --profile hobby
aws cloudfront create-invalidation --distribution-id E1ZTHQR1SVQVEY --paths "/index.html" --profile hobby
