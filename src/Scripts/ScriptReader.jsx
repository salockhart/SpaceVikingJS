import React from 'react';
import PropTypes from 'prop-types';
import Typewriter from 'react-typewriter';

class ScriptReader extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			script: this.props.script.slice(1),
			printedLines: [this.props.script[0]],
		};
	}

	onTypingEnd = () => {
		if (this.state.script.length === 0) {
			return this.props.onComplete();
		}
		const printedLines = this.state.printedLines;
		printedLines.push(this.state.script.shift());
		this.setState({
			printedLines: printedLines
		});
	}

	render() {
		const typingProps = {
			maxDelay: this.props.typingSpeed,
			minDelay: this.props.typingSpeed,
			onTypingEnd: this.onTypingEnd,
			onTyped: this.onToken,
			typing: 1,
		};
		return <span>{this.state.printedLines.map((line, idx) => <Typewriter key={idx} {...typingProps}>{line}</Typewriter>)}</span>;
	}

}

ScriptReader.propTypes = {
	typingSpeed: PropTypes.number.isRequired,
	script: PropTypes.array.isRequired,
	onComplete: PropTypes.func.isRequired,
	onToken: PropTypes.func.isRequired,
};

export default ScriptReader;