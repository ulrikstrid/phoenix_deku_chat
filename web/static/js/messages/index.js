/** @jsx element */
import element from 'virtual-element';

const Component = {
	propTypes: {
		messages: {
			source: 'messages'
		}
	},

	render({props}) {
		const {messages, mountEle} = props;
		const messageElements = messages.map((message) => {
			return (<p>[<a href="#">@{message.user}</a>]: {message.body}</p>);
		});

		return <div style="overflow: auto; height: 100%;">{messageElements}</div>;
	},

	afterRender (component, el) {
		el.scrollTop = el.scrollHeight;
	}
};

export default Component;