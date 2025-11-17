/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_232317621")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_mb0YTnUTos` ON `stories` (`user`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_232317621")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
