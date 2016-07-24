/**
 * IMAP Server for use with Amazon Simple Email Service (SES)
 *
 * Notes:
 * v0.1.0
 * 		Added lodash to top level dependency in package.json as workaround for npm
 *		not fully loading dependencies in sub branches
 */

var imapper = require("imapper");
var userAuth = require("imapper-auth-s3");
var storageModule = require("imapper-storage-s3ses");

/* Parameterize the configuration vars */

// extract command line argument list
var params = process.argv;

// if the first arg is node then remove the second arg which is the filename
if (params.shift().toLowerCase() == 'node') params.shift();

var arg, 
		metadataBucket, 
		authSuffix = '.auth.json',
    mboxKeySuffix = '.mbox.json',
    messageListKeySuffix = '.messagelist.json',
    mboxBucketSuffix = '.ses.inbound',
		port = 143, 
		useTLS = false,
		useSSL = false,
		plugins = [],
		debug = false;

while (arg = params.shift()) {
	switch(arg.toLowerCase()) {
		case '--debug': 
			debug = true;
		break;
		case '--mbox-bucket': 
			metadataBucket = params.shift();
		break;
		case '--auth-suffix': 
			authSuffix = params.shift();
		break;
		case '--mbox-suffix': 
			mboxKeySuffix = params.shift();
		break;
		case '--mlist-suffix': 
			messageListKeySuffix = params.shift();
		break;
		case '--mail-suffix': 
			mboxBucketSuffix = params.shift();
		break;
		case '--port': 
			port = params.shift();
		break;
		case '--usetls': 
			useTLS = true;
		break;
		case '--usessl': 
			useSSL = true;
		break;
		case '--plugin-id': 
			plugins.push("ID");
		break;
		case '--plugin-starttls': 
			plugins.push("STARTTLS");
		break;
		case '--plugin-sasl-ir': 
			plugins.push("SASL-IR");
		break;
		case '--plugin-auth-plain': 
			plugins.push("AUTH-PLAIN");
		break;
		case '--plugin-namespace': 
			plugins.push("NAMESPACE");
		break;
		case '--plugin-idle': 
			plugins.push("IDLE");
		break;
		case '--plugin-enable': 
			plugins.push("ENABLE");
		break;
		case '--plugin-condstore': 
			plugins.push("CONDSTORE");
		break;
		case '--plugin-xtoybird': 
			plugins.push("XTOYBIRD");
		break;
		case '--plugin-literalplus': 
			plugins.push("LITERALPLUS");
		break;
		case '--plugin-unselect': 
			plugins.push("UNSELECT");
		break;
		case '--plugin-special-use': 
			plugins.push("SPECIAL-USE");
		break;
		case '--plugin-create-special-use': 
			plugins.push("CREATE-SPECIAL-USE");
		break;
	} // switch
} // while arg

// sanity checks 
var errorMessage;
if (typeof metadataBucket == 'undefined') errorMessage = 'No S3 metadata bucket defined.';
if (typeof authSuffix == 'undefined') errorMessage = 'No authentication file suffix defined.';
if (typeof mboxKeySuffix == 'undefined') errorMessage = 'No mailbox metadata file suffix defined.';
if (typeof messageListKeySuffix == 'undefined') errorMessage = 'No message list file suffic';
if (typeof mboxBucketSuffix == 'undefined') errorMessage = 'No mailbox bucket suffix defined';
if (typeof port != 'number' || isNaN(port)) errorMessage = 'Port must be a valid number';

if (typeof errorMessage != 'undefined') {
	console.log('IMAP server initialization error:',errorMessage);
	process.exit(); // terminate
}

// configure plugins
userAuth.setS3Options('S3BucketName', metadataBucket);
userAuth.setS3Options('S3KeySuffix', authSuffix);
storageModule.setS3Options('S3BucketName', metadataBucket);
storageModule.setS3Options('S3MboxKeySuffix', mboxKeySuffix);
storageModule.setS3Options('S3MessageListKeySuffix', messageListKeySuffix);
storageModule.setS3Options('S3MboxBucketSuffix', mboxBucketSuffix);
storageModule.setConsoleMessages(debug);

var options = {
	tls: useTLS,
	ssl: useSSL,
	users: userAuth,
	storage: storageModule,
	plugins: plugins.length > 0 ? plugins: ["STARTTLS", "IDLE"],
	debug: debug
};

console.log('Starting IMAP server with the following options:',options);

var server = imapper(options);
server.listen(port);
console.log('IMAP server listening on port',port);
