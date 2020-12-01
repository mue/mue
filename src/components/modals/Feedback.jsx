import React from 'react';

export default class Feedback extends React.PureComponent {
    render() {
        return (
          <div className='feedback'>
            <h1>Give us feedback</h1>
            <span className='closeModal' onClick={this.props.modalClose}>&times;</span>
             <label>How would you rate your experience of this Mue Build?</label>
             <br/><br/>
             <label className='values'>0</label><input className='range' type='range' min='0' max='100' /><label className='values'>10</label>
             <br/><br/>
             <label>What bugs did you encounter in your use of Mue?</label>
             <br/><br/>
             <input type='text'/>
             <br/><br/>
             <label>How likely would you be to recommend this version of Mue to a friend or colleague?</label>
             <br/><br/>
             <label className='values'>0</label><input className='range' type='range' min='0' max='100' /><label className='values'>10</label>
             <br/><br/><br/>
             <button>Submit</button>
         </div>
        );
    }
}
