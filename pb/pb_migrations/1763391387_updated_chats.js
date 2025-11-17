/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358379819")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = storyEvent.story.user || @request.auth.id = povCharacter.user",
    "viewRule": "@request.auth.id = storyEvent.story.user || @request.auth.id = povCharacter.user"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1358379819")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = storyEvent.story.user",
    "viewRule": "@request.auth.id = storyEvent.story.user"
  }, collection)

  return app.save(collection)
})
