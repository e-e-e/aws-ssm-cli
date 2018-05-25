const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')

module.exports = function (filename, options) {
  if (!options) return
  if (!options.region) options.region = 'ap-southeast-2'
  if (!options.prefix) options.prefix = '/'
  let credentials
  if (options.profile) {
    credentials = new AWS.SharedIniFileCredentials({ profile: options.profile })
  }

  const ssm = new AWS.SSM({
    apiVersion: '2014-11-06',
    region: options.region,
    credentials
  })

  const params = {
    Path: options.prefix,
    Recursive: true,
    WithDecryption: true,
    MaxResults: 1
  }

  function processParameters (data) {
    if (!data || data.Parameters.length === 0) return
    console.log('Exporting', data.Parameters[0].Name)
    file.write(JSON.stringify(data.Parameters[0]))
    file.write('\n')
    if (data.NextToken) {
      const nextOptions = Object.assign({ NextToken: data.NextToken }, params)
      return ssm.getParametersByPath(nextOptions).promise()
        .then(processParameters)
    }
  }

  const file = fs.createWriteStream(path.resolve(process.cwd(), filename))
  ssm.getParametersByPath(params).promise()
    .then(processParameters)
    .then(() => { file.end() })
    .catch(e => {
      console.log('Encountered an error:\n', e)
    })
}
