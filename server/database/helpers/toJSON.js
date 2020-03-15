module.exports = schema => {
  // function handler
  function handler() {
    this.id = this._id;
  }
  
  schema.post('find', handler);
  schema.post('findOne', handler);
}