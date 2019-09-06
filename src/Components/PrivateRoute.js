import React from 'react'
import {Route, Redirect} from 'react-router-dom'

const PrivateRoute = ({component, ...rest}) =>
    <Route {...rest} render={routeProps =>
        true ?
            React.createElement(component, {...routeProps, ...rest})
            :
            <Redirect to={{pathname: '/', state: routeProps.location}}/>
    }/>

export default PrivateRoute
