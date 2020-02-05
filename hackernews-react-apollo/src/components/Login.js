import React, {useState} from 'react'
import {AUTH_TOKEN} from '../constants'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks';
import {useHistory} from "react-router-dom";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`
export default function Login() {

  const [isLoggingIn, setLogin] = useState(true);
  let nameInput, emailInput, passwordInput;
  const history = useHistory();

  const onTokenizeCompleted = (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
    history.push('/')
  }

  const [login] = useMutation(LOGIN_MUTATION, {onCompleted: ({login: {token}}) => onTokenizeCompleted(token)});
  const [signup] = useMutation(SIGNUP_MUTATION, {onCompleted: ({signup: {token}}) => onTokenizeCompleted(token)});

  return (
    <>
      <h4 className="mv3">{ isLoggingIn ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!isLoggingIn && (
          <input
            ref={node => {
              nameInput = node
            }}
            type="text"
            placeholder="Your name"
          />
        )} 
        <input
          ref={node => {
            emailInput = node
          }}
          type="text"
          placeholder="Your email address"
        />
        <input
          ref={node => {
            passwordInput = node
          }}
          type="password"
          placeholder={`${isLoggingIn
            ?"Enter your password"
            :"Choose a safe password"
          }`}
        />
      </div>
      <div className="flex mt3">
        <div 
          className="pointer mr2 button" 
          onClick={isLoggingIn
            ? () => login({
              variables: {email: emailInput.value, password: passwordInput.value}
            })
            : () => signup({
              variables: {email: emailInput.value, password: passwordInput.value, name: nameInput.value}
            })
          }
        >
          {isLoggingIn ? 'login' : 'create account'}
        </div>
        <div
          className="pointer button"
          onClick={() => setLogin(!isLoggingIn)}
        >
          {isLoggingIn
            ? 'need to create an account?'
            : 'already have an account?'}
        </div>

      </div>
    </>
  )
}
