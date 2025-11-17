/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = chat.storyEvent.story.user || @request.auth.id = chat.povCharacter.user",
    "viewRule": "@request.auth.id = chat.storyEvent.story.user || @request.auth.id = chat.povCharacter.user"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2605467279")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = chat.storyEvent.story.user",
    "viewRule": "@request.auth.id = chat.storyEvent.story.user"
  }, collection)

  return app.save(collection)
})
