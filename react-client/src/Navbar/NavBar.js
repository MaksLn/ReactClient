import React from 'react';
import { Navbar, Button, Container } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom'

export class MyNavBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = { isExit: false }

    this.onExit = this.onExit.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
  }

  onChangeName(e) {
    this.props.Name(e.target.value);
  }

  onExit() {
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('token');

    this.setState({ isExit: true })
  }

  render() {
    if (this.state.isExit) {
      this.setState({isExit:false})
      return <Redirect to='/'></Redirect>
    }

    return (
      <Navbar bg="light" expand='sm'>
        <Navbar.Brand><Link style={{ color: "black", textDecoration: 'none' }} to="/home">Информационная система деканата</Link></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Пользователь: <b>{this.props.Name}</b>
          </Navbar.Text>
          <Navbar.Text>
            <Container>
              <Button onClick={this.onExit} variant='light'>Выйти</Button>
            </Container>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}