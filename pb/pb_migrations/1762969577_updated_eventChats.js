/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358379819")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json18589324",
    "maxSize": 0,
    "name": "notes",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358379819")

  // remove field
  collection.fields.removeById("json18589324")

  return app.save(collection)
})
