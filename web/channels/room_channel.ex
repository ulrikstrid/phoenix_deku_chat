defmodule Chat.RoomChannel do
	use Phoenix.Channel
	use Amnesia
	use Database
	require Logger

	require Amnesia
	require Database.Room
	require Database.Message
	require Exquisite

	@doc """
	Authorize socket to subscribe and broadcast events on this channel & topic

	Possible Return Values

	`{:ok, socket}` to authorize subscription for channel for requested topic

	`:ignore` to deny subscription/broadcast on this channel
	for the requested topic
	"""
	def join("rooms:lobby", message, socket) do
		#%Room{name: "lobby"} |> Room.write!
		Process.flag(:trap_exit, true)
		send(self, {:after_join, message})

		Amnesia.transaction do
			Room.read(1) |> IO.inspect
		end

		{:ok, socket}
	end

	def join("rooms:" <> private_subtopic, message, socket) do
		%Room{name: private_subtopic} |> Room.write!
		Process.flag(:trap_exit, true)
		send(self, {:after_join, message})

		{:ok, socket}
		#{:error, %{reason: "unauthorized"}}
	end

	def handle_info({:after_join, msg}, socket) do
		broadcast! socket, "user:entered", %{user: msg["user"]}
		push socket, "join", %{status: "connected"}
		{:noreply, socket}
	end

	def handle_info(:ping, socket) do
		push socket, "new:msg", %{user: "SYSTEM", body: "ping"}
		{:noreply, socket}
	end

	def terminate(reason, _socket) do
		Logger.debug"> leave #{inspect reason}"
		:ok
	end

	def handle_in("new:msg", msg, socket) do
		broadcast! socket, "new:msg", %{user: msg["user"], body: msg["body"]}

		Amnesia.transaction do
			room = Room.read(1)

			%Message{room_id: room.id, msg: msg["body"], user: msg["user"]} |> Message.write!
		end

		{:reply, {:ok, %{msg: msg["body"]}}, assign(socket, :user, msg["user"])}
	end
end
