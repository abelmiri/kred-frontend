import React from "react"
import {Route, Redirect} from "react-router-dom"

const PrivateRoute = ({component, ...rest}) =>
    <Route {...rest} render={routeProps =>
        localStorage.hasOwnProperty("token") ?
            React.createElement(component, {...routeProps, ...rest})
            :
            <Redirect to="/"/>
    }/>

export default PrivateRoute
