import React from 'react';
import {Route, Redirect} from 'react-router-dom';

//PAra que no deje registrarnos o logearnos ya estando logea2
function AuthRoute({ component: Component, ...rest}) {
	const user = localStorage.getItem("email")

	return (
		<Route
			{...rest}
			render={props => 
				user ? <Redirect to="/profile" /> : <Component {...props} />
			}
		/>
	)
}

export default AuthRoute;