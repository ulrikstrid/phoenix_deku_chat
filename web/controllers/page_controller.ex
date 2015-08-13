defmodule Chat.PageController do
	use Chat.Web, :controller
	use Amnesia
	use Database

	require Database.Room
	require Database.Message

	def index(conn, _params) do
		render conn, "index.html"
	end

	def show(conn, %{"room" => room}) do
		Amnesia.transaction! do
			room = Room.read(1)
			messages = Message.read(room.id)

			render conn, "messages.json", messages: messages
		end
	end
end
