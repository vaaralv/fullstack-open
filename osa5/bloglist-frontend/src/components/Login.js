import PropTypes from 'prop-types'


const Login = (props) => {

    return(
     <form onSubmit={props.handleLogin}>
        <div>
          username
            <input
            id="username"
            type="text"
            value={props.username}
            name="Username"
            onChange={({ target }) => props.setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            id="password"
            type="password"
            value={props.password}
            name="Password"
            onChange={({ target }) => props.setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    )
}

Login.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }

export default Login