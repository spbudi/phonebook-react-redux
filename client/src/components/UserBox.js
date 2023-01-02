import React, { Component } from "react";
import UserForm from "./UserForm";
import UserList from "./UserList";
import UserSearchForm from "./UserSearchForm";
import axios from 'axios'

export default class UserBox extends Component {
    constructor(props) {
        super(props)
        this.params = {page: 1, name: '', phone: ''}
        this.state = {
            users: [],
            isAdd: false
        }
    }

    async componentDidMount() {
        this.loadUser()
    }

    loadUser = async () => {
        try {
            const { data } = await axios.get('http://localhost:3000/api/phonebooks', {params: this.params})
            if(data.status){
            this.setState({ users: [...(this.params.page === 1 ? []: this.state.users), ...data.data.result.map(item =>{
                item.sent = true
                return item
            }) 
        ]
        })

            this.params.page = data.data.page
            this.params.totalPage = data.data.totalPage

            }else{
                alert('gagal ambil data')
            }
            
        } catch (err) {
            console.log(err)
        }
    }

    addUser = async (name, phone) => {
        const id = Date.now()
        this.setState((state) => {
            return {
                users: [
                    ...state.users,
                    {
                        id,
                        name,
                        phone,
                        sent: true
                    }
                ]
            }
        })
        try {
            const { data } = await axios.post('http://localhost:3000/api/phonebooks', { name, phone })
            if (data.status) {
                this.setState((state) => ({
                    users: state.users.map(item => {
                        if (item.id === id) {
                            return { ...data.data, sent: true }
                        }
                        return item
                    })
                }))
            }
        }
        catch (err) {
            console.log(err)
            this.setState((state) => ({
                users: state.users.map(item => {
                    if (item.id === id) {
                        item.sent = false
                    }
                    return item
                })
            }))
        }
    }

    removeUser = async (id) => {
        try {
            this.setState((state) => ({
                users: state.users.filter(props => props.id !== id)
            }))
            await axios.delete(`http://localhost:3000/api/phonebooks/${id}`)
        } catch (err) {
            console.log(err)
        }
    }

    resendUser = async (id, name, phone) => {
        try {
        const { data } = await axios.post('http://localhost:3000/api/phonebooks', { name, phone })
            if (data.status) {
                console.log(data);
                this.setState((state) => ({
                    users: state.users.map(item => {
                        if (item.id === id) {
                            item.id = data.data.id
                            item.sent =  true
                        }
                        return item
                    })
                }))
            }
        } catch(err){
            console.log(err);
        }
    }

    updateUser = async ({id, name, phone}) => {
        const { data} = await axios.put(`http://localhost:3000/api/phonebooks/${id}`, { name, phone})
        try {
            if(data.status){
                this.setState((state)=> ({
                    users: state.users.map(item => {
                        if(item.id === id){
                            return { ...data.data, sent: true}
                        }
                        return item
                    })
                }))
            }
        } catch(err){
            alert('Failed to edit')
            console.log(err)
        }
    }

    searchUser = (query) => {
        console.log(query);
        this.params = { ...this.params, ...query, page: 1 }
        console.log(this.params);
        this.loadUser()
    }

    loadPagination = () => {
        if (this.params.page <= this.params.totalPage) {
            this.params = { ...this.params, page: this.params.page + 1 }
        }
        this.loadUser()
    }

    showAdd = (props) => {
        if (!props.show) {
            return null;
        }
        return (
            <div className="card mt-4">
                <div className="card-header">
                    <h6>Adding Form</h6>
                </div>
                <div className="card-body">
                    <UserForm submit={this.addUser} cancel={this.handleCancelClick} />
                </div>
            </div>
        );
    }

    handleClickAdd = () => {
        this.setState(state => ({
            isAdd: !state.isAdd
        }));
    }

    handleCancelClick = () => {
        this.setState({
            isAdd: false
        });
    }

    render() {

        return (
            <div className="container mt-3">
                <div className="card">
                    <div className="card-header text-center p-4">
                        <h1>Phone Book Apps</h1>
                    </div>
                </div>
                <div>
                    {this.state.isAdd ? <this.showAdd show={this.state.isAdd} /> : <button className='btn btn-primary mt-4' onClick={this.handleClickAdd} ><i className="fa-solid fa-plus"></i> add</button>}
                </div>

                <div className="card mt-4">
                    <div className="card-header">
                        <h6>Search Form</h6>
                    </div>
                    <div className="card-body">
                        <UserSearchForm submit={this.searchUser} />
                    </div>
                </div> 
                {/* <hr /> */}
                <UserList 
                data={this.state.users} 
                removeUser={this.removeUser} 
                updateUser={this.updateUser}
                resendUser={this.resendUser}
                loadUser ={this.loadPagination}
                />
                </div>
        )
    }
}