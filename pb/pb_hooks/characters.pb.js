/// <reference path="../pb_data/types.d.ts" />

onRecordCreate((e) => {
	e.next();

	$app.runInTransaction((txApp) => {
		const firstChar = txApp
			.findRecordsByFilter('characters', `user = "${e.record.get('user')}"`, 'created', 1)
			.at(0);

		if (!firstChar) return;
		if (firstChar.id === e.record.id) return;

		const col = txApp.findCollectionByNameOrId('chats');
		const record = new Record(col);
		record.set('povCharacter', firstChar.id);
		record.set('friend', e.record.id);
		txApp.save(record);
	});
}, 'characters');
