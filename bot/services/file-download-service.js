const download = require('download-file')

function dowloadImage(url, imageName, callback) {
    const options = {
        directory: './images',
        filename: `${imageName}.jpeg`
    }

    download(url, options, function (err) {
        if (err) {
            throw err
        } else {
            callback()
        }
    })
}

module.exports.downloadImage = dowloadImage