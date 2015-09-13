let bodyParser = require( 'body-parser' );
let express = require( 'express' );
let fetch = require( 'node-fetch' );
let minimist = require( 'minimist' );
let YAML = require( 'yamljs' );

let { Gist } = require( './gist' );
let { Http } = require( './http' );

let args = minimist( process.argv );

let user = args.username || process.env.GIST_PROXY_SERVER_USERNAME;
let password = args.password || process.env.GIST_PROXY_SERVER_PASSWORD;
let port = args.port || 80;

function getGistConfig( uid ) {

    return Gist.get( user, password, uid ).then( function ( gist ) {

        if ( ! Object.hasOwnProperty.call( gist.files, '_gist-proxy-server.yml' ) )
            throw new Http( 403, 'Missing configuration' );

        let gistConfig = gist.files[ '_gist-proxy-server.yml' ];

        return fetch( gistConfig.raw_url ).then( res => {

            if ( ! res.ok )
                throw new Http( 500, 'Configuration retrieval failed' );

            return res.text( );

        } ).then( configText => {

            return YAML.parse( configText );

        } ).then( config => {

            return { gist, config };

        }, error => {

            throw new Http( 500, 'Invalid configuration' );

        } ).catch( error => {

            throw new Http( 500, 'Unexpected error' );

        } );

    } );

}

var app = express( );

app.use( bodyParser.text( { type : '*/*' } ) );

app.use( ( req, res, next ) => {

  res.header( 'Access-Control-Allow-Origin', '*' );
  res.header( 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS' );
  res.header( 'Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept' );

  next( );

} );

app.get( '/:uid/:file', ( req, res ) => {

    getGistConfig( req.params.uid ).then( ( { gist, config } ) => {

        if ( ! Object.hasOwnProperty.call( config.files, req.params.file ) )
            throw new Http( 403, 'Unlisted file' );

        if ( ! [ 'all', 'readonly' ].includes( config.files[ req.params.file ] ) )
            throw new Http( 403, 'Cannot access file' );

        if ( ! Object.hasOwnProperty.call( gist.files, req.params.file ) )
            throw new Http( 403, 'File not found' );

        let gistFile = gist.files[ req.params.file ];

        console.log( `Fetching /${req.params.uid}/${req.params.file}` );

        return fetch( gistFile.raw_url ).then( file => {

            if ( ! file.ok )
                throw new Http( 500, 'File retrieval failed' );

            return file.text( );

        } ).then( fileText => {

            return res.contentType( gistFile.type ).send( fileText );

        } );

    } ).catch( error => {

        if ( error.status )
            res.status( error.status );

        res.send( error.message );

    } );

} );

app.put( '/:uid/:file', ( req, res ) => {

    getGistConfig( req.params.uid ).then( ( { gist, config } ) => {

        if ( ! Object.hasOwnProperty.call( config.files, req.params.file ) )
            throw new Http( 403, 'Unlisted file' );

        if ( ! [ 'all', 'writeonly' ].includes( config.files[ req.params.file ] ) )
            throw new Http( 403, 'Cannot access file' );

        if ( ! Object.hasOwnProperty.call( gist.files, req.params.file ) )
            throw new Http( 403, 'File not found' );

        let gistFile = gist.files[ req.params.file ];

        console.log( `Updating /${req.params.uid}/${req.params.file}` );

        return Gist.edit( user, password, req.params.uid, req.params.file, req.body ).then( fileText => {
            return res.contentType( gistFile.type ).send( fileText );
        } );

    } ).catch( error => {

        if ( error.status )
            res.status( error.status );

        res.send( error.message );

        console.log( error.stack );

    } );

} );

app.listen( 3000 );
