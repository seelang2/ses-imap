# IMAP Server for Amazon Simple Email Service (SES)
This module is an IMAP server to be used with Amazon SES.

SES provides an SMTP server for outbound email; however, it doesn't include any service to process incoming email messages. Incoming email is stored in S3 buckets (which can be configured on a per-email-account basis).

SES-IMAP uses [Imapper](https://www.npmjs.com/package/imapper) as the IMAP server, with [Imapper-Storage-S3SES](https://www.npmjs.com/package/imapper-storage-s3ses) and [Imapper-Auth-S3](https://www.npmjs.com/package/imapper-auth-s3) to access the message data and email account authentication credentials stored in S3.

**NOTE** This module and the storage plugin is still under development and may not be suited to production use.

## Usage

imapper-auth-s3 uses the Amazon SDK. Make sure you have set up the SDK per the [Amazon JavaScript SDK Getting Started Guide](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html).

Download from the GitHub repository or use `npm install`:

```sh
npm install ses-imap
```

Start the server from the command line:

```sh
sudo node ses-imap --mbox-bucket maildata
```

### Configuration options
The following parameters can be passed when starting the server:

* `--mbox-bucket <bucketname>` : Required. The S3 bucket where the mailbox metadata is stored. No default value.
* `--auth-suffix <suffix>` : Optional. The suffix added to the authentication file name. Default is '.auth.json'.
* `--mbox-suffix <suffix>` : Optional. The account metadata file suffix. Default is '.mbox.json'.
* `--mlist-suffix <suffix>` : Optional. The account message index file suffix. Default is  '.messagelist.json'.
* `--mail-suffix <suffix>` : Optional. The suffix used for the account S3 bucket containing the messages. Default is '.ses.inbound'.
* `--port <portnum>` : Optional. Port number the server listens on. Default is `143`.

The following parameters are optional. Omitting them defaults the values to `false`, while using them sets them to `true`.

* `--usetls` : Whether to support upgradable TLS connections. Relevant only if `--usessl` is not set.
* `--usessl` : Default is `false`.
* `--debug` : Verbose console output. Default is `false`.

You can also specify the plugins Imapper should use. The STARTTLS and IDLE plugins are enabled by default. You can override what plugins by including the following parameters:

`--plugin-id`, `--plugin-starttls`, `--plugin-sasl-ir`, `--plugin-auth-plain`, `--plugin-namespace`, `--plugin-idle`, `--plugin-enable`, `--plugin-condstore`, `--plugin-xtoybird`, `--plugin-literalplus`, `--plugin-unselect`, `--plugin-special-use`, `--plugin-create-special-use`

For more information about the plugins or server features please check the [Imapper documentation](https://www.npmjs.com/package/imapper).


## License 
MIT
