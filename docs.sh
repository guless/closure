#!/bin/sh
./node_modules/.bin/esdoc -c esdoc.json

if [ ! -d ./tmp ]
then
  mkdir ./tmp
fi

mv ./docs ./tmp
na=$(git rev-parse --abbrev-ref HEAD)
git checkout gh-pages

if [ -d ./docs ]
then
  rm -r ./docs
fi

mv ./tmp/docs ./
git add ./docs
git commit -m "Update api docs."
git push
git checkout $(na)