import fs from 'fs';


const getAllDirFiles = function(dirPath, arrayOfFiles) {
    var files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(file)
      }
    })
  
    return arrayOfFiles
}

const result = getAllDirFiles("./themes/aowlestore1.myshopify.com_129035632882_1642832795858")
console.log(result);