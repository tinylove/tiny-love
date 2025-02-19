var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.title = 'Module';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'module';
	locals.module = {
		id: 0
	};
	locals.lessons = [];

	view.on('init', function(next) {

		if (!req.user || !req.user._id) {
			return res.redirect('/');
		}

		if (!req.user.payed && !req.user.isAdmin) {
			return res.redirect('/user/pay');
		}

		next();
	});

	view.on('init', function(next) {

        keystone.list('User').model.findOne({_id: req.user._id}).exec(function(err, result) {

            locals.currentUser = result;
            next(err);
        });
    });

    view.on('init', function(next) {

        // Load the modules by sortOrder
    	keystone.list('Module').model.findOne({ key: req.params.module }).exec(function(err, result) {

			if (err || result === null) {
				return res.redirect('/user/dashboard');
			}
            locals.module = result;
			locals.title = result.name;

            next(err);
        });
    });

	view.on('init', function(next) {

        // Load the lessons by sortOrder
    	keystone.list('Lesson').model.find({ module: locals.module.id }).sort('sortOrder').exec(function(err, results) {
            locals.lessons = results;

            var foundCurrent = false;
			for (var i = 0; i < locals.lessons.length; ++i) {
                var lesson = locals.lessons[i];
				if (locals.currentUser.completedLessons.indexOf(locals.lessons[i]._id.toString()) !== -1) {
					lesson.status = 'completed';
                    lesson.class = 'lesson-list__link lesson-list__link--completed';
				}
				else {
                    if (!foundCurrent) {
                        foundCurrent = true;
                        lesson.status = 'current';
                    }
                    else {
                        lesson.status = 'uncompleted';
                    }
					lesson.class = 'lesson-list__link';
				}
			}

            next(err);
        });
    });

	// Render the view
	view.render('user/module');
};
