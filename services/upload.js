import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.fieldname==="foto") {
            cb(null, 'images')
        } else {
            cb(null, 'public')
        }
    },
    filename: function(req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
})

const upload = multer({storage: storage})

export default upload;