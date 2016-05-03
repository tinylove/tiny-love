var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	phone: { type: Types.Text, required: false },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	payed: { type: Types.Boolean, initial: false, required: false },
    completedLessons: { type: Types.Relationship, ref: 'Lesson', many: true },
    oneTimeLoginKey: { type: Types.Number, required: false, index: false },
    surveyAnswer: { type: Types.Html, wysiwyg: true, height: 400 },
    createdAt: { type: Types.Date, initial: Date.now() },
    location: { type: Types.Text, initial: false, required: true },
	contactType: { type: Types.Text, initial: false, required: true },
	referralType: { type: Types.Text, initial: false, required: true }
	
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Is Admin', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

// User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin, payed, createdAt';
User.register();
