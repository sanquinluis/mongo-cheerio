//require mongoose
var mongoose = require('mongoose');
//create Schema class
var Schema = mongoose.Schema;

//creating a article schema
var ArticleSchema = new Schema({

	//title required
	title: {
		type:String,
		required:true
	},
	//summary es required
	summary: {
		type:String,
		required:true
	}, 
	note: {
		type: Schema.Types.ObjectId,
		ref: 'note'
	}
});

//Create the Article module with in ArticleSchema
var Article = mongoose.model('Article',ArticleSchema);

//export the model
module.exports = Article;