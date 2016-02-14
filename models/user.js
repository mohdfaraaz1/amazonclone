var mongoose 	= require("mongoose");
var bcrypt		= require("bcrypt-nodejs");
var Schema 		= mongoose.Schema;

// User Schema attributs
var UserSchema = new Schema({
	email: { type: String, unique: true, lowercase: true},
	password: String,

	profile: {
		name: { type: String, default: ''},
		picture: { type: String, default: ''}
	},

	address: String,
	history: [{
		date: Date,
		paid: { type: Number, default: 0},
		//item: {type: Schema.Types.ObjectId, ref: ''}
	}]
});

// Hash the password before we even save it to database
UserSchema.pre('save',function(next){
	var user = this;
	if(!user.isModified('password'))
		return next();
	bcrypt.genSalt(10,function(err, salt){
		if(err)
			return next(err);
		bycrypt.hash(user.password, salt, null, function(err,hash){
			if(err)
				return next(err);
			user.password = hash;
			next();
		});
	});
});

//Compare the password in database with the user input
UserSchema.methods.comparePassword = function(password){
	return bycrypt.compareSync(password,this.password);
};

module.export = 