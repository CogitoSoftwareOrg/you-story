/// <reference path="../pb_data/types.d.ts" />

onRecordCreate((e) => {
	// before creation

	e.next();

	$app.runInTransaction((txApp) => {
		// do something in the transaction
		const col = txApp.findCollectionByNameOrId('subs');
		const record = new Record(col);
		record.set('user', e.record.id);
		txApp.save(record);
	});

	// after creation
}, 'users');
