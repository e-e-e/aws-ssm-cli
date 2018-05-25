const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const readline = require('readline')

module.exports = function (file, options) {
  if (!options) return
  if (!options.region) options.region = 'ap-southeast-2'
  let credentials
  if (options.profile) {
    credentials = new AWS.SharedIniFileCredentials({ profile: options.profile })
  }

  const ssm = new AWS.SSM({
    apiVersion: '2014-11-06',
    region: options.region,
    credentials
  })

  function putParameter (data) {
    const params = {
      Name: data.Name,
      Type: data.Type,
      Value: data.Value,
      Overwrite: false
    }
    if (data.Type === 'SecureString') {
      params.KeyId = options.encryptionKeyId
    }
    return ssm.putParameter(params).promise()
  }

  const inputFile = fs.createReadStream(path.resolve(process.cwd(), file))
  const lineReader = readline.createInterface({ input: inputFile })
  const parameters = []
  lineReader.on('line', (data) => {
    parameters.push(JSON.parse(data))
  })

  lineReader.on('close', () => {
    parameters.reduce((promise, data) => {
      return promise.then(() => {
        console.log('Importing', data.Name)
        return putParameter(data)
      })
    }, Promise.resolve())
  })
}
