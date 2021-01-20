const fs = require('fs-extra')
const path = require('path')
const packageJson = fs.readJsonSync(path.resolve(__dirname, '..', 'package.json'))

const whitelistedKeys = [
    'name',
    'version',
    'description',
    'author',
    'main',
    'types',
    'repository',
    'dependencies'
]

packageJson.peerDependencies = packageJson.peerDependencies || {}

Object.keys(packageJson.dependencies).forEach((key) => {
    const version = packageJson.dependencies[key].replace(/[^0-9.]/g, '')
    packageJson.dependencies[key] = `>=${version}`

    if (!packageJson.whitelistedDependencies?.includes(key)) {
        packageJson.peerDependencies[key] = packageJson.dependencies[key]
        delete packageJson.dependencies[key]
    }
})

if (!Object.keys(packageJson.dependencies).length) {
    delete packageJson.dependencies
}

Object.keys(packageJson).forEach((key) => {
    if (!whitelistedKeys.includes(key)) {
        delete packageJson[key]
    }
})

const targetPackageJsonPath = path.resolve(__dirname, '..', 'build', 'package.json')
fs.outputJsonSync(targetPackageJsonPath, packageJson, { spaces: 2 })
