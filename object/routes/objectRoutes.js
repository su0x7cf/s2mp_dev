const objectController = require("../controllers/objectController");

module.exports = (app) => {
    //route to upload object
    app.post("/upload", objectController.upload);
    //route to download object
    // app.get("/download", objectController.download); // REMOVE or comment out this line, handler does not exist
    //route to delete object
    // app.delete("/delete", objectController.delete); // REMOVE or comment out this line, handler does not exist
    // route to delete a post file by filename
    app.delete("/delete/:filename", objectController.deleteByFilename);
    //route to get all objects
    app.get("/objects", objectController.getAllObjects);
    //route to get object by id
    app.get("/object/:id", objectController.getObjectById);
    //route to get object by name
    app.get("/object/name/:name", objectController.getObjectByName);
    //route to get object by type
    app.get("/object/type/:type", objectController.getObjectByType);
    // route to get multiple objects by filenames (POST)
    app.post("/objects/by-filenames", objectController.getObjectsByFilenames);
    // route to download a file by filename
    app.get("/download/:filename", objectController.downloadByFilename);

}
