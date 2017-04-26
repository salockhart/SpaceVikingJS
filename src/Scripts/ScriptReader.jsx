import React from 'react';
import PropTypes from 'prop-types';
import Typewriter from 'react-typewriter';

class ScriptReader extends React.Component {

	render() {
		const typingProps = {
			maxDelay: this.props.typingSpeed,
			minDelay: this.props.typingSpeed,
			onTypingEnd: this.props.onComplete,
			typing: 1,
		};
		return <Typewriter {...typingProps}>{this.props.script.map((line, idx) => <span key={idx}>{line}</span>)}</Typewriter>;
	}

}

ScriptReader.propTypes = {
	typingSpeed: PropTypes.number.isRequired,
	script: PropTypes.array.isRequired,
	onComplete: PropTypes.func.isRequired,
};

export default ScriptReader;