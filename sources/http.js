export class Http extends Error {

    constructor( status, message ) {

        super( );

        this.status = status;
        this.message = `HTTP ${status}: ${message}`;

    }

};
