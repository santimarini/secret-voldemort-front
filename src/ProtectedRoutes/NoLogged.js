import React from 'react';
import {Route, Redirect} from 'react-router-dom';

//PAra que no deje registrarnos o logearnos ya estando logea2
function NoLogged({ component: Component, ...rest}) {
	const user = localStorage.getItem("email")

	return (
		<Route
			{...rest}
			render={props => 
				!user ? <Redirect to="/login" /> : <Component {...props} />
			}
		/>
	)
}

export default NoLogged;