function uploadFile(url,filePath,name,formData={}){
  return new Promise((resolve,reject)=>{
    let opts = { url, filePath, name, formData,success:resolve,fail:reject};
    wx.uploadFile(opts);
  })
}

module.exports.uploadFile=uploadFile;