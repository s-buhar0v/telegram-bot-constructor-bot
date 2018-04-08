
const azure = require('azure-storage')

const blobService = azure.createBlobService('botctor', 'QMEgytzatRyo5f7kZUVOX/dMjQIKVz8T6i7m8DZ/xEwsvuy+ojK6p1ge+9bTLL3PFJReVLGBtNYoL7uhVTULIw==')

function savePhoto(name, callback) {
    blobService.createContainerIfNotExists('photos', {
        publicAccessLevel: 'blob'
    }, function (error, result, response) {
        if (!error) {
            blobService.createBlockBlobFromLocalFile('photos', name, `./images/${name}.jpeg`, (err, result) => {
                if (err) {
                    throw err
                } else {
                    let photoUrl = blobService.getUrl('photos', name)
                    callback(photoUrl)
                }
            })
        }
    })
}

module.exports.savePhoto = savePhoto
