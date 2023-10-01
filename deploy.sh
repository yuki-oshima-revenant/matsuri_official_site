#/bin/bash

npm run build
aws s3 rm s3://matsuri.unronritaro.net/ --recursive --profile hobby
aws s3 cp ./build s3://matsuri.unronritaro.net/ --recursive --profile hobby
