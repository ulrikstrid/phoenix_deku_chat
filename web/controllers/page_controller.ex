defmodule Chat.PageController do
	use Chat.Web, :controller
	use Amnesia
	use Database

	def index(conn, _params) do
		render conn, "index.html"
	end

	def show(conn, %{"room" => room}) do

		roomId = room = Room.where! name == room,
			select: id

		messages = Message.where! room_id == roomId

		render conn, "messages.json", messages: messages
	end
end
