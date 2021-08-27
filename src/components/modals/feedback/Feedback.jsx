import { PureComponent } from 'react';

import './feedback.scss';

export default class FeedbackModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      question_one: 5,
      question_two: {
        value: '',
        error: ''
      },
      question_three: 5,
      question_four: {
        value: '',
        error: ''
      },
      formsubmit: ''
    };
    this.language = window.language.modals.feedback;
  }

  async submitForm(e) {
    e.preventDefault();

    let question_two_error, question_four_error;

    if (this.state.question_two.value.length <= 0) {
      question_two_error = this.language.not_filled;
    }

    if (this.state.question_four.value.length <= 0) {
      question_four_error = this.language.not_filled;
    }

    if (question_two_error || question_four_error) {
      this.setState({
        question_two: {
          error: question_two_error
        },
        question_four: {
          error: question_four_error
        }
      });
    } else {
      this.setState({
        question_two: {
          error: ''
        },
        question_four: {
          error: ''
        }
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
        <form>
          <input type='hidden' name='version' value={window.constants.VERSION} />
          <div className='question'>
            <label>{this.language.question_one}</label>
            <br/><br/>
            <label className='values'>0</label>
            <input className='range' type='range' min='0' max='10' name='questionone' value={this.state.question_one} onChange={(e) => this.setState({ question_one: e.target.value })}/>
            <label className='values'>10 ({this.state.question_one})</label>
          </div>
          <div className='question'>
            <label>{this.language.question_two}</label>
            <textarea name='questiontwo' onChange={(e) => this.setState({ question_two: { value: e.target.value }})}/>
            <p className='feedbackerror'>{this.state.question_two.error}</p>
          </div>
          <div className='question'>
            <label>{this.language.question_three}</label>
            <br/><br/>
            <label className='values'>0</label>
            <input className='range' type='range' min='0' max='10' name='questionthree' value={this.state.question_three} onChange={(e) => this.setState({ question_three: e.target.value })}/>
            <label className='values'>10 ({this.state.question_three})</label>
          </div>
          <div className='question'>
            <label>{this.language.question_four}</label>
            <textarea name='questionfour' value={this.state.question_four.value} onChange={(e) => this.setState({ question_four: { value: e.target.value }})}/>
            <p className='feedbackerror'>{this.state.question_four.error}</p>
          </div>
          <p>{this.state.formsubmit}</p>
          <button onClick={(e) => this.submitForm(e)}>{this.language.submit}</button>
        </form>
      </div>
    );
  }
}
