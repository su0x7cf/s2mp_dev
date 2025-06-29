module.exports = (app) => {
    //route to upload object
    app.post("/upload", objectController.upload);
    //route to download object
    app.get("/download", objectController.download);
    //route to delete object
    app.delete("/delete", objectController.delete);
    //route to get all objects
    app.get("/objects", objectController.getAllObjects);
    //route to get object by id
    app.get("/object/:id", objectController.getObjectById);
    //route to get object by name
    app.get("/object/name/:name", objectController.getObjectByName);
    //route to get object by type
    app.get("/object/type/:type", objectController.getObjectByType);      
    
}
