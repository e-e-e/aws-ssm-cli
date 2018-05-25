# aws-ssm-cli

A cli tool to help manage ssm variables across multiple aws accounts

# install

```sh
npm install aws-ssm-cli -g
```

## usage

#### `ssm export [options] [file]`

Export ssm variables into a line separated JSON file.

```
  Usage: export [options] <file>

  Options:

    -r, --region <region>    Set the region
    -p, --profile <profile>  Which AWS profile to use
    -n, --prefix <prefix>    Export only keys matching prefix
    -h, --help               output usage information
```

#### `ssm import [options] [file]`

Import ssm variables stored as line separated JSON file.

```
  Usage: import [options] <file>

  Options:

    -r, --region <region>        Set the region
    -p, --profile <profile>      Which AWS profile to use
    -k, --encryptionKeyId <key>  A key to sign secure string parameters
    -h, --help                   output usage information
```


