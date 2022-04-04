/* eslint-disable react/jsx-key */
import { NextPage } from 'next';
import Image from 'next/image';
import { providers } from "ethers";
import { GoogleReCaptchaProvider, useGoogleReCaptcha, GoogleReCaptcha } from 'react-google-recaptcha-v3';
import axios from 'axios';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import Link from 'next/link';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
          56: 'https://bsc-dataseed1.ninicoin.io'
      },
      chainId: 56
    }
  },
}

type StateType = {
  provider?: any
  web3Provider?: any
  address?: string
  chainId?: number
}

const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: '',
  chainId: 0,
}

type ActionType =
| {
    type: 'SET_WEB3_PROVIDER'
    provider?: StateType['provider']
    web3Provider?: StateType['web3Provider']
    address?: StateType['address']
    chainId?: StateType['chainId']
  }
| {
    type: 'SET_ADDRESS'
    address?: StateType['address']
  }
| {
    type: 'SET_CHAIN_ID'
    chainId?: StateType['chainId']
  }
| {
    type: 'RESET_WEB3_PROVIDER'
  }

let web3Modal: Web3Modal;

if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions 
  })
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}

const initialValues = {
  username: '',
  email: '',
  contract: '',
  password: '',
  acceptTerms: false,
};

const SignupFormSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  contract: Yup.string().required("Contract is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  acceptTerms: Yup.bool().oneOf([true], "Accept Ts & Cs is required"),
});

const SignUp: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { provider, web3Provider, address, chainId } = state
  const [contracts, setContracts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('/api/contracts').then(({ data }) => {
      setContracts(data.contract);
    }).catch((error) => {
      let message;
      if (error.response) {
        message = error.response.data.message;
      } else {
        message = error.message;
      }
      setErrorMessage(message);
    })
  }, []);

  const connect = useCallback(
    async () => {
      try {
        const provider = await web3Modal.connect();
      
        const web3Provider = new Web3(provider);
    
        const signer = await web3Provider.eth.getAccounts();
        const address = await signer[0];

        const network = await web3Provider.eth.net.getId();
        dispatch({
          type: 'SET_WEB3_PROVIDER',
          provider,
          web3Provider,
          address,
          chainId: network
        });
      } catch (error) {
        console.log(error);
      }
    }, []
  );

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect()
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER'
      })
    }, [provider]
  );

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect]);

  return (
    <div>
      <div className='container'>
        <div className='row justify-content-center align-items-center'>
          <div className='col-xl-5 col-md-6'>
            <div className='mini-logo text-center'> 
              <Link href='/'>
                <a>
                  <Image src='/images/logo.png' height={86} width={200} alt='Logo'/>
                </a>
              </Link>
              <h4 className='card-title '>
                Sign Up
              </h4>
            </div>
            <div className='auth-form card mb-1'>
              <div className='card-body'>
                {/* <GoogleReCaptcha onVerify={function (token: string): void | Promise<void> {
                  console.log(token)
                } } /> */}
                {web3Provider ? (
                  <>
                    <Formik initialValues={initialValues} validationSchema={SignupFormSchema} onSubmit={async (fields) => {
                      alert(JSON.stringify(fields, null, 4));
                    } }>
                      {({ errors, status, touched }) => (
                        <Form>
                          <div>
                            <div className='row'>
                              <div className='col-12 mb-2'>
                                <label className='form-label'>Username</label>
                                <input name='username' type='text' autoComplete='off' className={ "form-control" + (errors.username && touched.username? " is-invalid": "") } />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                              </div>
                              <div className='col-12 mb-2'>
                                <label className='form-label'>Email</label>
                                <input name='email' type='email' autoComplete='off' className={ "form-control" + (errors.email && touched.email? " is-invalid": "") } />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                              </div>
                              <div className='col-12 mb-2'>
                                <label className='form-label'>Package</label>
                                <select name='contract' defaultValue={''} className={ "form-control" + (errors.contract && touched.contract? " is-invalid": "") }>
                                  <option value='' hidden>-- Select Package --</option>
                                  {contracts.map((contract) => (
                                    <option value={contract['id']} key={contract['id']}>{contract['name']} - $ {contract['value']}</option>
                                  ))}
                                </select>
                                <ErrorMessage name="contract" component="div" className="invalid-feedback" />
                              </div>
                              <div className='col-12 mb-2'>
                                <label className='form-label'>Password</label>
                                <input name='password' autoComplete='off' type='password' className={ "form-control" + (errors.password && touched.password? " is-invalid": "") } />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                              </div>
                              <div className='col-12'>
                                <div className='form-check'>
                                  <input type='checkbox' name='acceptTerms' className='form-check-input'  />
                                  <label className='form-check-label'>
                                    I certify that I am 18 years of age or older, and agree to the <a href='#' className='text-primary'>User Agreement</a> and <a href='#' className='text-primary'>Privacy Policy</a>.
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className='mt-3 d-grid gap-2'>
                              <button type='submit' className='btn btn-primary mr-2'>
                                Sign Up
                              </button>
                            </div>
                            <div className='mt-3 d-grid gap-2'>
                              <button typeof='button' className='button btn btn-danger' type='button' onClick={disconnect}>
                                Disconnect From {address?.substring(0, 5)} ... {address?.substring(address.length - 5, address.length)}
                              </button>
                            </div>
                          </div>
                        </Form>
                      )}

                    </Formik>
                  </>
                ) : (
                  <div className='text-center'>
                    <button className='button btn btn-success' type='button' onClick={connect}>
                      Connect To Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className='text-center'>
              {errorMessage && <h4 className='text-danger'>{errorMessage}</h4>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return(
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY}>
      <SignUp />
    </GoogleReCaptchaProvider>
  )
}

export default App;