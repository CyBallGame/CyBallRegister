import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { CSSTransition } from 'react-transition-group'
import { toast } from 'react-toastify'
import axios from 'axios'
import { API_CYBALL, EMAIL_REGEX, PASSWORD_REG } from 'config/constant'
import useAuth from 'hooks/useAuth'
import { ConnectorNames } from 'utils/web3React'
import useWeb3 from 'utils/useWeb3'
import { useEffect, useState } from 'react'
import LoaderIcon from 'LoaderIcon'
import backgroundCountDown from 'assets/images/background_countdown.png'
import loginButtonBackground from 'assets/images/login-button-background.png'
import loginButtonHover from 'assets/images/login-button-background-hover.png'
import loginModalImage from 'assets/images/login-modal.png'

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-image: url(${backgroundCountDown});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100vh;
`
const TextHeader = styled.div`
  font-size: 2.4rem;
  color: #fefefe;
  font-weight: 600;
  margin-bottom: 32px;
`

const LoginButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-image: url('${loginButtonBackground}');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 280px;
  transition: background-image 0.3s ease-in, transform 0.1s ease-in;
  padding: 15px 10px;
  border-radius: 2px;

  &:not(:last-of-type) {
    margin-bottom: 20px;
  }

  &:hover {
    cursor: pointer;
    background-image: url(${loginButtonHover});
  }

  &:active {
    transform: translateY(-2px);
    opacity: 80%;
  }

  & > div {
    font-size: 1.6rem;
    color: #fefefe;
    font-weight: 700;
  }
`

const LoginModal = styled.div`
  margin: 0 auto;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${loginModalImage});
  background-repeat: no-repeat;
  background-size: contain;
  justify-content: center;
  background-position: center;
  padding: 0px 100px;
  height: 450px;
  width: 400px;

  @media (max-width: 576px) {
    width: 300px;
    height: 500px;
    padding: 0px;
  }
`

const InputWrapper = styled.div`
  width: 300px;
  height: 40px;
  margin-bottom: 5px;
  position: relative;
  clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 6px) 100%, 0% 100%, 0 19px);
  background: linear-gradient(180deg, #b596dc 0%, #3d296a 15px) #22144a;
`

const Input = styled.input`
  font-size: 1.6rem;
  position: absolute;
  top: 2px;
  left: 2px;
  width: 100%;
  height: calc(100% - 4px);
  font-weight: 500;
  padding: 0px 15px;
  color: #e0e0e0;
  font-family: 'Orbitron', sans-serif;
  border: none;
  background: #22144a;
  clip-path: polygon(15px 0, 100% 0, calc(100% - 6px) 100%, 0% 100%, 0 18px);
`
const ErrorText = styled.div`
  font-size: 0.8rem;
  color: red;
  width: 300px;
  bottom: 2px;
`

const AccountWrapper = styled.div`
  position: relative;
  display: flex;
  width: 300px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
`

const AccountText = styled.div`
  position: absolute;
  font-weight: 500;
  font-size: 1.7rem;
  color: #e0e0e0;
  letter-spacing: 2px;
`

const InfoText = styled.div`
  font-size: 1rem;
  color: red;
  text-align: center;
`

const NoticeText = styled.div`
  font-size: 1.2rem;
  color: #fefefe;
  text-align: center;

  a {
    color: #fefefe;
  }
`

const SuccessText = styled.div`
  font-size: 1rem;
  color: green;
  text-align: center;
`

const connectors = [
  {
    title: 'Metamask',
    connectorId: ConnectorNames.Injected,
  },
]

function App() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const { account } = useWeb3React()
  const web3 = useWeb3()

  const formatAddress = (address) => {
    if (address) {
      const addressArr = address.split('')
      return `${addressArr.slice(0, 11).join('')}...${addressArr.slice(-11).join('')}`
    }

    return null
  }

  // Clear input when change metamask acc
  useEffect(() => {
    setPassword('')
    setEmail('')
  }, [account])

  const onHandleLogin = async () => {
    try {
      if (!email) {
        setEmailError('Email is required')
        return
      }

      if (!EMAIL_REGEX.test(email)) {
        setEmailError('Invalid email address')
        return
      }
      if (!PASSWORD_REG.test(password)) {
        setPasswordError('Invalid password')
        return
      }

      if (!password) {
        setPasswordError('Password is required')
        return
      }
      setEmailError(null)
      setPasswordError(null)
      setIsLoading(true)
      const timestamp = new Date().getTime()
      const message = `${email}-${timestamp}`
      const signedData = await web3.eth.personal.sign(message, account)
      const result = await axios.post(API_CYBALL, {
        email,
        password,
        address: account,
        signedData,
        timestamp,
      })

      if (result.data) {
        toast.success('Successfully create account', {
          hideProgressBar: true,
        })
        setEmail('')
        setPassword('')
        setIsSignUp(true)
      }
      setIsLoading(false)
    } catch (error) {
      const messageCode = error && error.response && error.response.data && error.response.data.code

      if (error.code === 4001) {
        toast.error(error.message, {
          hideProgressBar: true,
        })
        setIsLoading(false)
        return
      }

      if (messageCode === 'invalid_password') {
        toast.error('Invalid Passowrd', {
          hideProgressBar: true,
        })
        setIsLoading(false)
        return
      }
      toast.error('Your metamask account or your email has been taken', {
        hideProgressBar: true,
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="App">
      <LoginWrapper>
        <LoginModal>
          <>
            {!isSignUp ? (
              <>
                <TextHeader>Create Cyball Account</TextHeader>
                <CSSTransition in={!!account} timeout={300} unmountOnExit classNames="fade">
                  <>
                    <InputWrapper>
                      <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          if (e) {
                            setEmail(e.target.value)
                          }
                        }}
                      />
                    </InputWrapper>
                    {emailError && <ErrorText>{emailError}</ErrorText>}
                    <br />
                    <InputWrapper data-tip data-for="passwordError">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                          if (e) {
                            setPassword(e.target.value)
                          }
                        }}
                      />
                    </InputWrapper>
                    <ErrorText>
                      {passwordError}
                    </ErrorText>
                    <ReactTooltip id="passwordError" type="error">
                      <span
                        style={{
                          fontSize: '10px',
                        }}
                      >
                        Password must contain:
                        <ul>
                          <li>8 characters long</li>
                          <li>1 upper case</li>
                          <li>1 lower case alphabet</li>
                          <li>1 number</li>
                          <li>1 special character</li>
                        </ul>
                      </span>
                    </ReactTooltip>
                    <br />
                    <InputWrapper>
                      <Input value={formatAddress(account)} disabled />
                    </InputWrapper>
                  </>
                </CSSTransition>
                <br />
                {!account ? (
                  <LoginButton
                    onClick={() => {
                      login(connectors[0].connectorId)
                    }}
                  >
                    <div>Log in Metamask account</div>
                  </LoginButton>
                ) : (
                  <LoginButton onClick={onHandleLogin}>{isLoading ? <LoaderIcon /> : <div>Sign up</div>}</LoginButton>
                )}
                {account && !isSignUp && (
                  <InfoText>One Metamask account can only be linked to one CyBall account</InfoText>
                )}
              </>
            ) : (
              <>
                <TextHeader>Sign Up Successfully</TextHeader>
                <NoticeText>
                  <span>
                    Back to
                    {' '}
                    <a target="_blank" href="https://cyball.com/" rel="noreferrer">
                      Home Page
                    </a>
                  </span>
                </NoticeText>
              </>
            )}
          </>
        </LoginModal>
      </LoginWrapper>
    </div>
  )
}

export default App
