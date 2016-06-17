#!/bin/sh

if [ ! -d ./tmp ]
then
  mkdir ./tmp
fi

./node_modules/.bin/esdoc -c esdoc.json

mv ./docs ./tmp
git checkout gh-pages

if [ -d ./docs ]
then
  rm -r ./docs
fi

mv ./tmp/docs ./
git add --all
git commit -m "Update api docs."
git push
git checkout dev
