import React from 'react'

export default class Forma extends React.Component {
    constructor(props) {
        super(props);

        this.state ={ data: {}, isFetching: true, error: null };
    }

    componentDidMount() {
        fetch('https://localhost:5001/api/groups/1')
            .then(response => response.json())
            .then(result => {this.setState({data: result, isFetching: false });
            console.log(result);})
            .catch(e => {
              console.log(e);
              this.setState({data: this.state.data, isFetching: false, error: e })
            });
    }

    render() {
        const { data, isFetching, error } = this.state;
        
        if (isFetching) return <div>...Loading</div>;

        if (error) return <div>{`Error: ${error.message}`}</div>;

        return <h1>{data[0].id}</h1>;
    }


}