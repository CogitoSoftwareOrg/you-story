/// <reference path="../pb_data/types.d.ts" />

onRecordCreate((e) => {
	e.record.set('status', 'active');
	e.record.set('tariff', 'free');
	e.record.set('stripeInterval', 'month');

	e.record.set('currentPeriodStart', new Date().toISOString());
	e.record.set(
		'currentPeriodEnd',
		new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 100, 1)).toISOString()
	);
	// MONTHLY LIMITS FOR FREE USERS
	e.record.set('pointsLimit', 100);

	e.next();

	$app.runInTransaction((txApp) => {});
}, 'subs');
