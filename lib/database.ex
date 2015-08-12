use Amnesia

defdatabase Database do
	deftable Room

	deftable Message, [:room_id, :msg, :user], type: :bag do
		@type t :: %Message{room_id: non_neg_integer, msg: String.t, user: String.t}

		def room(self) do
			Room.read(self.room_id)
		end

		def room!(self) do
			Room.read!(self.room_id)
		end
	end

	deftable Room, [{ :id, autoincrement }, :name], type: :ordered_set, index: [:name] do
		@type t :: %Room{id: non_neg_integer, name: String.t}

		def add_message(self, msg, user) do
			%Message{room_id: self.id, msg: msg, user: user} |> Message.write
		end

		def add_message!(self, msg, user) do
			%Message{room_id: self.id, msg: msg, user: user} |> Message.write!
		end

		def messages(self) do
			Message.read(self.id)
		end

		def messages!(self) do
			Message.read!(self.id)
		end
	end
end
