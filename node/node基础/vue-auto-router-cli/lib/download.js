const { promisify } = require('util')
const download = promisify(require('download-git-repo'))
const ora = require('ora')

module.exports.clone = async function (repo, desc) {
  const process = ora(`🚀下载...${repo}`)
  process.start()
  await download(repo, desc)
  process.succeed()
}