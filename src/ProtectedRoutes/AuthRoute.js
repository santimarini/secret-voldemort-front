import React from 'react';
import {Route, Redirect} from 'react-router-dom';

// so that you do not let us log in or register once logged in
function AuthRoute({ component: Component, ...rest}) {
	const user = localStorage.getItem("token")

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
