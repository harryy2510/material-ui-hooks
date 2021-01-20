export PATH=$(npm bin):$PATH

VERSION=`auto version`

if [ ! -z "$VERSION" ]; then
  ## Update Changelog
  auto changelog

  ## Publish Package
  npm version $VERSION -m "chore: release v%s [skip ci]"
  npm run build
  node ./scripts/clean-and-copy.js
  npm publish build

  ## Create GitHub Release
  git push --follow-tags --set-upstream origin $branch
  auto release
fi