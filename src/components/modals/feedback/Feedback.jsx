import React from 'react';

import './feedback.scss';

export default class FeedbackModal extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      questionone: 5,
      questionthree: 5,
      questiontwoerror: '',
      questionfourerror: '',
      formsubmit: ''
    };
  }

  async submitForm () {
    let questiontwoerror, questionfourerror;

    if (document.getElementById('questiontwo').value.length <= 0) {
      questiontwoerror = 'Question box must be filled';
    }

    if (document.getElementById('questionfour').value.length <= 0) {
      questionfourerror = 'Question box must be filled';
    }

    if (questiontwoerror || questionfourerror) {
      this.setState({
        questiontwoerror: questiontwoerror,
        questionfourerror: questionfourerror
      });
    } else {
      this.setState({
        questiontwoerror: '',
        questionfourerror: ''
      });

      await fetch(window.constants.FEEDBACK_FORM, {
        'method': 'POST'
      });

      this.setState({
        formsubmit: 'Sent successfully!'
      });

      setTimeout(() => {
        this.props.modalClose();
      }, 3000);
    }
  }

  render() {
    const { feedback } = window.language.modals;

    return (
      <div className='feedback'>
        <h1>{feedback.title}</h1>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <>
          <input type='hidden' name='version' value={window.constants.VERSION} />
          <>
            <label>{feedback.question_one}</label>
            <br/><br/>
            <label className='values'>0</label>
            <input className='range' type='range' min='0' max='10' name='question1' value={this.state.questionone} onChange={(e) => this.setState({ questionone: e.target.value })}/>
            <label className='values'>10 ({this.state.questionone})</label>
          </>
          <br/><br/>
          <>
            <label>{feedback.question_two}</label>
            <textarea name='question2' id='questiontwo'/>
            <p className='feedbackerror'>{this.state.questiontwoerror}</p>
          </>
          <>
            <label>{feedback.question_three}</label>
            <br/><br/>
            <label className='values'>0</label>
            <input className='range' type='range' min='0' max='10' name='question3' value={this.state.questionthree} onChange={(e) => this.setState({ questionthree: e.target.value })}/>
            <label className='values'>10 ({this.state.questionthree})</label>
          </>
          <br/><br/>
          <>
            <label>{feedback.question_four}</label>
            <textarea name='question4' id='questionfour'/>
            <p className='feedbackerror'>{this.state.questionfourerror}</p>
          </>
          {this.state.formsubmit}
          <button onClick={() => this.submitForm()}>{feedback.submit}</button>
        </>
      </div>
    );
  }
}
