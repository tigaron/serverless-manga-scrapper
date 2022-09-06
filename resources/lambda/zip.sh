#!/usr/bin/env bash
rm -rf chrome-aws-lambda && chrome-aws-lambda.zip
git clone --depth=1 https://github.com/Sparticuz/chrome-aws-lambda.git && \
cd chrome-aws-lambda && \
make ../chrome-aws-lambda.zip && \
echo 'Layer created successfully!'
