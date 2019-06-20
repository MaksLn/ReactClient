import { Switch, Route } from 'react-router-dom';
import React from 'react';
import { LoginFrom } from './LoginForm/LoginForm';
import { Home } from './Home/Home'
import { GroupList } from './Home/group/groupList';
import { AddGroup } from './Home/group/AddGroup';
import { UpdateGroup } from './Home/group/UpdateGruop';
import { UserList } from './Home/users/userList';
import { AddUser } from './Home/users/AddUser';
import { UpdateUser } from './Home/users/UpdateUser';
import { StudentList } from './Home/student/studentList';
import { AddStudent } from './Home/student/AddStudent';
import { UpdateStudent } from './Home/student/UpdateStudent';
import { Historys } from './Home/student/Historys';
import { AddSkips } from './Home/student/AddSkips';
import { AddHistory } from './Home/student/AddHistorys';

export class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = { Name: sessionStorage.getItem('name') };
        this.onChangeName = this.onChangeName.bind(this);
    }

    onChangeName(name) {
        this.setState({ Name: name });
        this.props.onChangeName(this.state.Name)
    }

    render() {
        return (<div>
            <Switch>
                <Route exact path='/' render={(props) => <LoginFrom onChangeName={this.props.onChangeName}></LoginFrom>} />
                <Route path='/home' component={Home}></Route>
                <Route path='/group' component={GroupList}></Route>
                <Route path='/AddGroup' component={AddGroup}></Route>
                <Route path='/UpdateGroup' component={UpdateGroup}></Route>
                <Route path='/user' component={UserList}></Route>
                <Route path='/AddUser' component={AddUser}></Route>
                <Route path='/UpdateUser' component={UpdateUser}></Route>
                <Route path='/student' component={StudentList}></Route>
                <Route path='/AddStudent' component={AddStudent}></Route>
                <Route path='/UpdateStudent' component={UpdateStudent}></Route>
                <Route path='/Historys' component={Historys}></Route>
                <Route path='/AddSkips' component={AddSkips}></Route>
                <Route path='/AddHistory' component={AddHistory}></Route>
            </Switch>
        </div>
        )
    }
}