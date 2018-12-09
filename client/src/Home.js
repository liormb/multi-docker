import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            value: '',
            values: {},
            indexes: [],
        };
    }
    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }
    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({ values: values.data });
    }
    async fetchIndexes() {
        const indexes = await axios.get('/api/values/all');
        this.setState({ indexes: indexes.data });
    }
    async handleSubmit(event) {
        event.preventDefault();

        await axios.post('/api/values', {
            value: this.state.value,
        });

        this.setState({ value: '' });
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter yor index:</label>
                    <input
                        value={this.state.input}
                        onChange={e => this.setState({ value: e.target.value })}
                    />
                    <button>Submit</button>
                </form>
                <h3>Indexes I have seen:</h3>
                {this.state.indexes.map(({ number }) => number).join(', ')}
                <h3>Calculated Values:</h3>
                {Object.keys(this.state.values).map(key => (
                    <div key={key}>
                        - For index {key} we calculated: {this.state.values[key]}
                    </div>
                ))}
            </div>
        );
    }
}

export default Home;
