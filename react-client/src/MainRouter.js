import React from 'react';
import { Main } from './Main';
import { MyNavBar } from './Navbar/NavBar';


export class MyRouter extends React.Component {
    constructor(props) {
        super(props);

        this.state = { Name: sessionStorage.getItem('name') };
        this.onChangeName = this.onChangeName.bind(this);
    }

    onChangeName(name) {
        this.setState({ Name: name });
    }
    
    render() {
        return (<div>
            <MyNavBar Name={this.state.Name} />
            <Main onChangeName={this.onChangeName} />
        </div>)
    }
}