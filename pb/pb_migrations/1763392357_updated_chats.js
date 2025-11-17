/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358379819")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_fTRn0dfzp9` ON `chats` (`storyEvent`)",
      "CREATE INDEX `idx_EV8DSeRqH0` ON `chats` (`povCharacter`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358379819")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
