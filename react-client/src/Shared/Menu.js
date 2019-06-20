import React from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export class Menu extends React.Component {

    render() {
        return (
            <Nav className="flex-column">
                <Nav.Link><Link to='/user'>Пользователи</Link></Nav.Link>
                <Nav.Link eventKey="/group"><Link to='/group'>Группы</Link></Nav.Link>
                <Nav.Link eventKey="link-2"><Link to='/student'>Студенты</Link></Nav.Link>
            </Nav>
        )
    }
}