define(['durandal/composition','jquery'], function(composition, $) {
	var ctor = function() { };

	ctor.prototype.activate = function(settings) {
		this.settings = settings;
		this.strLabel = settings.strLabel || 'Missing Label';
	};

	return ctor;
});

