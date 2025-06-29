const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage }).single("media");

exports.upload = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        // Return file info for reference in post
        res.status(200).json({
            message: "File uploaded successfully",
            file: {
                filename: req.file.filename,
                path: req.file.path,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    });
};

// Download a file by filename (stream/binary)
exports.downloadByFilename = (req, res) => {
    const { filename } = req.params;
    if (!filename) {
        return res.status(400).json({ error: "Filename required" });
    }
    const filePath = path.join(__dirname, "../uploads/", filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }
    const mime = require('mime-types');
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    // If video, support range requests
    if (contentType.startsWith('video/')) {
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': contentType,
            });
            file.pipe(res);
            return;
        }
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': contentType,
        });
        fs.createReadStream(filePath).pipe(res);
        return;
    }
    // For images and other files, just stream with correct content type
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
};

// Delete a file by filename
exports.deleteByFilename = (req, res) => {
    const { filename } = req.params;
    if (!filename) {
        return res.status(400).json({ error: "Filename required" });
    }
    const filePath = path.join(__dirname, "../uploads/", filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "File deleted" });
    });
};

// Stubs for other methods
exports.getAllObjects = (req, res) => { res.status(501).send("Not implemented"); };
exports.getObjectById = (req, res) => { res.status(501).send("Not implemented"); };
exports.getObjectByName = (req, res) => { res.status(501).send("Not implemented"); };
exports.getObjectByType = (req, res) => { res.status(501).send("Not implemented"); };

// Get all objects by user (by filenames)
exports.getObjectsByFilenames = (req, res) => {
    const { filenames } = req.body;
    if (!Array.isArray(filenames)) {
        return res.status(400).json({ error: "filenames must be an array" });
    }
    const uploadDir = path.join(__dirname, "../uploads/");
    const files = filenames.map(filename => {
        const filePath = path.join(uploadDir, filename);
        if (fs.existsSync(filePath)) {
            return {
                filename,
                url: `/uploads/${filename}`,
                size: fs.statSync(filePath).size
            };
        } else {
            return null;
        }
    }).filter(Boolean);
    res.status(200).json({ files });
};
