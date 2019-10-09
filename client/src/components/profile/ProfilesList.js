import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'

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
                return (<ProfileListItemFragment {...p} />)
            })

            return (<div className="container">
                <div className="card white" style={{ padding: 5 }}>
                    <h4 className="center-text"
                        style={{
                            marginBottom: "50px",
                            marginLeft: "10px",
                            fontFamily: "Urbana"
                        }}>List of Profiles</h4>
                    {list}
                </div>
            </div>)
        }
        return (<div>Error</div>)
    }

}
class ProfileListItemFragment extends Component {
    render() {
        return (
            <Fragment key={this.props._id} style={{ marginBottom: "20px" }}>
                <div className='row'>
                <Link to={'/profile/' + this.props.handle}
                    style={{
                        fontSize: 18,
                        fontFamily: "Urbana",
                        letterSpacing: "1px",
                        border: '1px solid #2BB673',
                        padding: 10,
                        borderRadius: "10px"
                    }} >{this.props.handle}
                </Link>
                </div>
            </Fragment>
        )
    }
}
export default ProfilesList