const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// ✅ Prevent OverwriteModelError:
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
