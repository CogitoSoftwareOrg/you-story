export const GET = async ({ params }) => {
	const { storyId, eventId, chatId } = params;
	console.log(storyId, eventId, chatId);
	return new Response('Hello, world!');
};
