#!/usr/bin/env sh

export VUE_APP_API_URL="https://dolos.ugent.be/api"
export BASE_URL="https://dolos.ugent.be/server"

rm -r dist/*
yarn build:server
rsync -glpPrtvz --delete dist/ dolos:dolos/server/
