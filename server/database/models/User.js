const { Schema } = require('mongoose');
const { hashPassword } = require('../../common/password');
const { promisify } = require('util');

module.exports = (mongoose) => {
  const schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
  });

  schema.pre('save', async function save (next) {
    if (this.isNew) {
      this.password = await hashPassword(this.password);
      this.createdOn = new Date();
    }
    
    this.updatedOn = new Date();
      
    next();
  });

  schema.post('init', function (doc) {
    doc.name = `${doc.firstName || ''}${doc.middleName ? ' ' : ''}${doc.middleName || ''} ${doc.lastName || ''}`;
  });
  schema.post('save', function (doc) {
    doc.name = `${doc.firstName || ''}${doc.middleName ? ' ' : ''}${doc.middleName || ''} ${doc.lastName || ''}`;
  });

  const model = mongoose.model('User', schema);

  return model;
}