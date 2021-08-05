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
    this.language = window.language.modals.feedback;
  }

  async submitForm () {
    let questiontwoerror, questionfourerror;

    if (document.getElementById('questiontwo').value.length <= 0) {
      questiontwoerror = this.language.not_filled;
    }

    if (document.getElementById('questionfour').value.length <= 0) {
      questionfourerror = this.language.not_filled;
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
        method: 'POST'
      });

      this.setState({
        formsubmit: this.language.success
      });

      setTimeout(() => {
        this.props.modalClose();
      }, 5000);
    }
  }

  render() {
    return (
      <div className='feedback'>
        <h1>{this.language.title}</h1>
        <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
        <>
          <input type='hidden' name='version' value={window.constants.VERSION} />
          <>
            <label>{this.language.question_one}</label>
            <br/><br/>
            <label className='values'>0</label>
            <input className='range' type='range' min='0' max='10' name='question1' value={this.state.questionone} onChange={(e) => this.setState({ questionone: e.target.value })}/>
            <label className='values'>10 ({this.state.questionone})</label>
          </>
          <br/><br/>
          <>
            <label>{this.language.question_two}</label>
            <textarea name='question2' id='questiontwo'/>
            <p className='feedbackerror'>{this.state.questiontwoerror}</p>
          </>
          <>
            <label>{this.language.question_three}</label>
            <br/><br/>
            <label className='values'>0</label>
            <input className='range' type='range' min='0' max='10' name='question3' value={this.state.questionthree} onChange={(e) => this.setState({ questionthree: e.target.value })}/>
            <label className='values'>10 ({this.state.questionthree})</label>
          </>
          <br/><br/>
          <>
            <label>{this.language.question_four}</label>
            <textarea name='question4' id='questionfour'/>
            <p className='feedbackerror'>{this.state.questionfourerror}</p>
          </>
          <p>{this.state.formsubmit}</p>
          <button onClick={() => this.submitForm()}>{this.language.submit}</button>
        </>
      </div>
    );
  }
}
