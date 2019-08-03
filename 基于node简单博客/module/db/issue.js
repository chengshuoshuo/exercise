const mongoose = require('./connect');


var issueScheam = new mongoose.Schema({
    time: String,
    time2: Number,
    issuetitle: String,
    issuecontent: String,
    issuetag: Array,
    readNumber:Number,
    auther: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'guest'
    }]
});

var issue = mongoose.model('issue', issueScheam);

module.exports = issue;