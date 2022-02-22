import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { SwitchTransition, Transition } from 'react-transition-group'
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
  margin-bottom: 24px;
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
    margin-bottom: 10px;
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
const FadeDiv = styled.div`
  transition: 0.3s;
  opacity: ${({ state }) => (state === 'entered' ? 1 : 0)};
  display: ${({ state }) => (state === 'exited' ? 'none' : 'block')};
`

const LoginModal = styled.div`p>
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
  padding: 0px 30px;
  height: 550px;
  width: 400px;

  @media (max-width: 576px) {
    width: 300px;
    height: 500px;
    padding: 0px;
  }
`
const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
const ForgotPasswordText = styled.div`
  font-size: 1.6rem;
  color: #7979f7;
  font-weight: 700;
  margin-bottom: 10px;

  &:hover {
    cursor: pointer;
  }
`
const Text = styled.div`
  color: white;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 24px;
`

const connectors = [
  {
    title: 'Metamask',
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'WalletConnect',
    connectorId: ConnectorNames.WalletConnect,
  },
  {
    title: 'Binance Wallet',
    connectorId: ConnectorNames.BSC,
  },
]

const FadeTransition = ({ children, ...rest }) => (
  <Transition {...rest}>{(state) => <FadeDiv state={state}>{children}</FadeDiv>}</Transition>
)

function App() {
  const { login, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [emailReset, setEmailReset] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [emailResetError, setEmailResetError] = useState(null)
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

  const onHandleLogout = () => {
    logout()
  }

  const onHandleResetPassword = async () => {
    try {
      if (!emailReset) {
        setEmailResetError('Email is required')
        return
      }

      if (!EMAIL_REGEX.test(emailReset)) {
        setEmailResetError('Invalid email address')
        return
      }

      setIsLoading(true)
      const result = await axios.post(`${API_CYBALL}/ForgotPassword`, {
        email: emailReset,
      })

      toast.success("We've just sent you an email.", {
        hideProgressBar: true,
      })
      setIsLoading(false)
    } catch (error) {
      toast.error(error.message, {
        hideProgressBar: true,
      })
      setIsLoading(false)
    }
  }

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

      if (password !== confirmPassword || !confirmPassword) {
        toast.error('Please make sure your password match', {
          hideProgressBar: true,
        })

        return
      }

      setEmailError(null)
      setPasswordError(null)
      setIsLoading(true)
      const timestamp = new Date().getTime()
      const message = `${email}-${timestamp}`
      const signedData = await web3.eth.personal.sign(message, account)
      const result = await axios.post(`${API_CYBALL}/SignUp`, {
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
          {!isSignUp ? (
            <>
              <SwitchTransition mode="out-in">
                <FadeTransition key={account || isForgotPassword} timeout={250} unmountOnExit mountOnEnter>
                  {isForgotPassword ? (
                    <ContentWrapper>
                      <TextHeader>Forgot Password</TextHeader>
                      <Text>Please enter your registered email address below.</Text>
                      <InputWrapper>
                        <Input
                          placeholder="Email"
                          autoComplete="off"
                          value={emailReset}
                          onChange={(e) => {
                            if (e) {
                              setEmailReset(e.target.value)
                            }
                          }}
                        />
                      </InputWrapper>
                      {emailResetError && <ErrorText>{emailResetError}</ErrorText>}
                      <br />
                      <LoginButton onClick={onHandleResetPassword}>
                        {isLoading ? <LoaderIcon /> : <div>Reset</div>}
                      </LoginButton>
                      <LoginButton
                        onClick={() => {
                          setIsForgotPassword(false)
                        }}
                      >
                        <div>Cancel</div>
                      </LoginButton>
                    </ContentWrapper>
                  ) : account ? (
                    <ContentWrapper>
                      <TextHeader>Create Cyball Account</TextHeader>
                      <InputWrapper>
                        <Input
                          placeholder="Email"
                          autoComplete="off"
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
                          autoComplete="off"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            if (e) {
                              setPassword(e.target.value)
                            }
                          }}
                        />
                      </InputWrapper>
                      <ErrorText>{passwordError}</ErrorText>
                      <br />
                      <InputWrapper>
                        <Input
                          type="password"
                          autoComplete="off"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => {
                            if (e) {
                              setConfirmPassword(e.target.value)
                            }
                          }}
                        />
                      </InputWrapper>
                      <ReactTooltip id="passwordError" type="error">
                        <span
                          style={{
                            fontSize: '10px',
                          }}
                        >
                          Password must contain:
                          <ul>
                            <li>8 characters long</li>
                            <li>at least 1 upper case alphabet</li>
                            <li>at least 1 lower case alphabet</li>
                            <li>at least 1 number</li>
                          </ul>
                        </span>
                      </ReactTooltip>
                      <br />
                      <InputWrapper>
                        <Input value={formatAddress(account)} disabled />
                      </InputWrapper>
                      <br />
                      <LoginButton onClick={onHandleLogin}>
                        {isLoading ? <LoaderIcon /> : <div>Sign up</div>}
                      </LoginButton>
                      <LoginButton onClick={onHandleLogout}>
                        <div>Log out</div>
                      </LoginButton>
                      {!isSignUp && <InfoText>One Metamask account can only be linked to one CyBall account</InfoText>}
                    </ContentWrapper>
                  ) : (
                    <ContentWrapper>
                      <TextHeader>Create Cyball Account</TextHeader>
                      <LoginButton
                        onClick={() => {
                          login(connectors[0].connectorId)
                        }}
                      >
                        <div>Log in Metamask</div>
                      </LoginButton>
                      <LoginButton
                        onClick={() => {
                          login(connectors[1].connectorId)
                        }}
                      >
                        <div>Log in WalletConnect</div>
                      </LoginButton>
                      <LoginButton
                        onClick={() => {
                          login(connectors[2].connectorId)
                        }}
                      >
                        <div>Log in BinanceWallet</div>
                      </LoginButton>
                      <ForgotPasswordText onClick={() => setIsForgotPassword(true)}>
                        Forgot your password ?
                      </ForgotPasswordText>
                    </ContentWrapper>
                  )}
                </FadeTransition>
              </SwitchTransition>

              <br />
            </>
          ) : (
            <>
              <TextHeader>Sign Up Successfully</TextHeader>
              <NoticeText>
                <span>
                  Back to
                  <a target="_blank" href="https://cyball.com/" rel="noreferrer">
                    &nbsp;Home Page
                  </a>
                </span>
              </NoticeText>
            </>
          )}
        </LoginModal>
      </LoginWrapper>
    </div>
  )
}

export default App
