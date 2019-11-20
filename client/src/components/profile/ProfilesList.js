import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import Spinner from "../common/Spinner";

class ProfilesList extends Component {
    state = {
        profiles: null
    }
    componentDidMount = () => {
        Axios.get('/api/profile/listAllProfiles')
            .then((res) => {
                this.setState({ profiles: res.data })
            })
    }
    render() {
        const profiles = this.state.profiles
        if (profiles) {
            const list = profiles.map((p) => {
                return (<ProfileListItemFragment {...p} key={p.id} />)
            })

            return (
                <div className="container" style={{ marginBottom: "20px" }}>
                    <div className="card white" style={{ padding: 5 }}>
                        <ul className="collection with-header">
                        <Link to="/friendsList"><i className="material-icons right">people</i></Link>
                            <li className="collection-header"><h3>List of Profiles</h3>
                            </li>
                            {list}
                        </ul>
                    </div>
                </div>)
        }
        return (<Spinner />)
    }

}
class ProfileListItemFragment extends Component {
    render() {
        return (
            <Fragment >
                <a href={'/profile/' + this.props.handle} className='collection-item'>
                    {this.props.handle}
                </a>
            </Fragment>
        )
    }
}
export default ProfilesList