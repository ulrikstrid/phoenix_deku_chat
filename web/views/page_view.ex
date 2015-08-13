defmodule Chat.PageView do
	use Chat.Web, :view

	def render("messages.json", %{messages: messages}) do
		messages
	end
end
