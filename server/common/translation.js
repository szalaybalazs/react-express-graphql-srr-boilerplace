module.exports = {
  getTranslation: (input, language) => input[language] || input.en || '-',

} 
