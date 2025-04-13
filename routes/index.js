var express = require('express');
const fileUpload = require('express-fileupload');
var router = express.Router();
const pdfparse = require('../pdf-parse.js');

router.use(fileUpload({
  // Configure file uploads with maximum file size 10MB
  limits: { fileSize: 10 * 1024 * 1024 },

  // Temporarily store uploaded files to disk, rather than buffering in memory
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

router.get('/', (req, res) => {
  res.send('Hello World!')
})

/* POST file home page. */
router.post('/', async function(req, res, next) {
  // Was a file submitted?
  if (!req.files || !req.files.file) {
    return res.status(422).send('No files were uploaded');
  }

  const uploadedFile = req.files.file;
  let result = await pdfparse(uploadedFile.tempFilePath, uploadedFile.name);
  res.send(result)

});

module.exports = router;
