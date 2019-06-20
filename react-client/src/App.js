import React from 'react';
import { LoginFrom } from './LoginForm/LoginForm';

export class App extends React.Component {




  render() {
    return (
      <div>
        <LoginFrom onChangeName={this.onChangeName}></LoginFrom>
      </div>
    );
  }
}

export default App;
