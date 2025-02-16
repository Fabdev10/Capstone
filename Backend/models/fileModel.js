import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    public_id: String,
    url: String,
    originalname: String,
    mimetype: String,
    size: Number,
  });
  

  const File = mongoose.model('File', fileSchema);
  
  export default File;