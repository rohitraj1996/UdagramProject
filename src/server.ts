import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Get valid-url object
  // Credit: https://stackoverflow.com/questions/30931079/validating-a-url-in-node-js/30931191
  var validUrl = require('valid-url');
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage?:image_url", async( req, res ) => {
    const { image_url } = req.query;

    if (validUrl.isUri(image_url)) {
      filterImageFromURL(image_url).then(response => {
        res.status(200).sendFile(response);
        res.on('finish', ()=>{
          deleteLocalFiles([response]);
        });
      })

    }
    else
      res.status(400).send("URL for Image is invalid.")
  });

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();