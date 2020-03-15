const fs = require('fs');
const path = require('path');

const content = `
DB_URI=mongodb+srv://test:alma@cluster0-o0f5y.mongodb.net/test?retryWrites=true&w=majority
AWS_ACCESS_KEY=AKIAJMFO5S4U2QVVD36A
AWS_SECRET_KEY=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
PORT=80
S3_BUCKET_NAME=elisa.dev
`

fs.writeFileSync(path.join(__dirname, '..', '.env'), content)
