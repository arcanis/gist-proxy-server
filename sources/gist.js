let fetch = require( 'node-fetch' );

let { Http } = require( './http' );

export let Gist = {

    get( user, password, uid ) {

        return fetch( `https://${user}:${password}@api.github.com/gists/${uid}` ).then( res => {

            if ( res.status === 404 )
                throw new Http( 404, 'Gist not found' );

            if ( ! res.ok )
                throw new Http( 500, 'Unexpected error' );

            return res.json( );

        } );

    },

    edit( user, password, uid, file, body ) {

        return fetch( `https://${user}:${password}@api.github.com/gists/${uid}`, { method : 'PATCH', body : JSON.stringify( { files : { [file] : { content : body } } } ) } ).then( res => {

            if ( res.status === 404 )
                throw new Http( 404, 'Gist not found' );

            if ( ! res.ok )
                throw new Http( 500, 'Unexpected error' );

            return body;

        } );

    }

};
