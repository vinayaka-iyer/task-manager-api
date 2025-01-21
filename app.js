const express = require('express');
const app = express();

app.use(express());

app.listen(process.env.PORT || 8000, () => {
	console.log('Listening on port 8000...');
});
