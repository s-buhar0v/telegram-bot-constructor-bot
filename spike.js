const azure = require('azure-storage');

const blobService = azure.createBlobService('botctor', 'QMEgytzatRyo5f7kZUVOX/dMjQIKVz8T6i7m8DZ/xEwsvuy+ojK6p1ge+9bTLL3PFJReVLGBtNYoL7uhVTULIw==')


blobService.createContainerIfNotExists('photos', {
    publicAccessLevel: 'blob'
}, function (error, result, response) {
    if (!error) {

    }
});


var download = require('download-file')

var url = 'https://api.telegram.org/file/bot577699506:AAHwrM8MOn90uJjwatX9Uxi7q3X9Yei4Hk0/photos/file_24.jpg'

var options = {
    filename: "cat.jpeg"
}

download(url, options, function (err) {
    setTimeout(() => {
        // blobService.createBlockBlobFromLocalFile('photos', '1', './cat.jpeg', (err, result) => {
        //     console.log(result)
        //     console.log(err)
        // })
    }, 1000)

})







