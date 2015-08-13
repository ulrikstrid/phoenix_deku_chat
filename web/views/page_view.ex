defmodule Chat.PageView do
  use Chat.Web, :view

	def render("messages.json", %{messages: messages}) do
		%{data: messages}
	end

	def render("message.json", %{message: message}) do
		%{
			msg: message.msg,
			user: message.user
		}
	end
end
