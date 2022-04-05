/* eslint-disable react/jsx-key */
import Image from 'next/image';
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3';
import axios from 'axios';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import Link from 'next/link';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { v4 as uuid } from "uuid";
import bcryptjs from "bcryptjs";
import next from 'next';

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

function initialValues(referral:string) {
  return {
    username: '',
    email: '',
    contract: '',
    password: '',
    acceptTerms: false,
    referral: referral
  };
}

const SignupFormSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  contract: Yup.string().required('Contract is required'),
  referral: Yup.string().required('Referral is required'),
  email: Yup.string().email('Email is invalid').required('Email is required'),
  password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  acceptTerms: Yup.bool().oneOf([true], 'Accept Ts & Cs is required'),
});

const App = () => {
  const router = useRouter();
  const[referral, setReferral] = useState(router.query['referral']);
  const [state, dispatch] = useReducer(reducer, initialState)
  const { provider, web3Provider, address, chainId } = state
  const [contracts, setContracts] = useState([]);
  const [account, setAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [progress, setProgress] = useState('');
  const contractAbi = [
    {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
  ];
  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;
  const aviorContract = process.env.NEXT_PUBLIC_AVIOR_CONTRACT;
  const aviorPrice: any = process.env.NEXT_PUBLIC_AVIOR_PRICE || 0;

  const handleReCaptchaVerify = async (token: string) => {
    if (!token) {
      return;
    }
    token && setIsValidToken(true);
  };

  useEffect(() => {
    if(!router.isReady) return;
    setReferral(router.query['referral']);
    if(!referral) return;

    async function getCrontracts() {
      await axios.get('/api/contracts/').then(({ data }) => {
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
    }
    async function getReferral() {
      axios.get('/api/accounts/', { params : { uuid : referral }}).then(({ data }) => {
        if(data.account !== null) setAccount(data.account.username);
      }).catch((error) => {
        let message;
        if (error.response) {
          message = error.response.data.message;
        } else {
          message = error.message;
        }
        setErrorMessage(message);
      })
    }

    getCrontracts();
    getReferral();
  }, [referral, router.isReady, router.query]);

  const handleSubmit = async (fields: any) => {
    setErrorMessage('');

    const contract: any = contracts?.find(q => q['id'] == fields.contract);
    const aviorNeed: number = contract.value * aviorPrice;

    setProgress(`Waiting for wallet response. You need ${aviorNeed} AVIOR to complete this process`);
    window.onbeforeunload = () => "Don't leave this page while sign up is on progress";
        
    const resAccount: any = await axios.post('/api/accounts', {
      uuid: uuid(),
      username: fields.username,
      email: fields.email,
      password: bcryptjs.hashSync(fields.password, bcryptjs.genSaltSync()),
      idContract: fields.contract,
      type: 1,
      walletAddress: address,
      emailVerification: 0,
      deletedAt: new Date()
    });
    const resActive = await axios.patch('/api/accounts', {
      id: 15,
      deletedAt: null
    });
    if (resAccount.data.message === 'The username already exists') {
      setErrorMessage(resAccount.data.message);
      setProgress('');
      window.onbeforeunload = () => null;
      return;
    }

    const web3Contract = new web3Provider.eth.Contract(contractAbi, aviorContract);
    
    await web3Contract.methods.transfer(adminWallet, web3Provider.utils.toWei(aviorNeed.toString(), 'ether')).send({
      from: address, gas: 100000}).on("transactionHash", function () {
        setProgress('Transaction submitted. Please wait for confirmation');
      })
      .on("receipt", function () {
        setProgress('Receipt created');
      })
      .on("error", async function (error: any) {
        setErrorMessage(error);
        setProgress(error);
        setProgress('');
        window.onbeforeunload = () => null;
        return;
      });
    
    
    if (errorMessage === '') {
      const resActive = await axios.patch('/api/accounts', {
        id: resAccount.data.account.id,
        deletedAt: null
      });
      
      if (resActive.status === 200) {
        router.push('/signup/success')
      }
    }

    setProgress('');
    window.onbeforeunload = () => null;
  }

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
        alert(error);
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
  
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0]
        })
      }

      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])

  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY}>
      <GoogleReCaptcha onVerify={(token) => handleReCaptchaVerify(token) } />
      {isValidToken && (
        <>
          <div className='container'>
            <div className='row justify-content-center align-items-center mt-4'>
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
                    {progress === '' ? (
                      <>
                        <div className='text-center'>
                          <h4 className='text-warning'>Sign up in progress</h4>
                          <small>Dont close this tab or close your browser!!!</small>
                          <hr />
                          <strong>{progress}</strong>
                        </div>
                      </>
                    ): (
                      <>
                        {web3Provider ? (
                          <>
                            <Formik initialValues={initialValues(account)} validationSchema={SignupFormSchema} onSubmit={async (fields) => {
                              await handleSubmit(fields)
                            } } enableReinitialize>
                              {({ errors, status, touched, values, isSubmitting, isValid }) => (
                                <Form>
                                  <div>
                                    <div className='row'>
                                      <div className='col-12 mb-2'>
                                        <label className='form-label'>Username</label>
                                        <Field name='username' type='text' className={ 'form-control' + (errors.username && touched.username? ' is-invalid': '') } />
                                        <ErrorMessage name='username' component='div' className='invalid-feedback' />
                                      </div>
                                      <div className='col-12 mb-2'>
                                        <label className='form-label'>Email</label>
                                        <Field name='email' type='email' className={ 'form-control' + (errors.email && touched.email? ' is-invalid': '') } />
                                        <ErrorMessage name='email' component='div' className='invalid-feedback' />
                                      </div>
                                      <div className='col-12 mb-2'>
                                        <label className='form-label'>Contract</label>
                                        <Field name='contract' as='select' className={ 'form-control' + (errors.contract && touched.contract? ' is-invalid': '') }>
                                            <option value='' hidden>-- Select Contract --</option>
                                            {contracts.map((contract) => (
                                              <option value={contract['id']} key={contract['id']}>$ {contract['value']}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name='contract' component='div' className='invalid-feedback' />
                                      </div>
                                      <div className='col-12 mb-2'>
                                        <label className='form-label'>Password</label>
                                        <Field name='password' type='password' className={ 'form-control' + (errors.password && touched.password? ' is-invalid': '') } />
                                        <ErrorMessage name='password' component='div' className='invalid-feedback' />
                                      </div>
                                      <div className='col-12 mb-2'>
                                        <label className='form-label'>Referral</label>
                                        <Field name='referral' type='text' readOnly className={ 'form-control' + (errors.referral && touched.referral? ' is-invalid': '') } />
                                        <ErrorMessage name='referral' component='div' className='invalid-feedback' />
                                      </div>
                                      <div className='col-12'>
                                        <div className='form-check'>
                                          <Field type='checkbox' name='acceptTerms' className='form-check-input' />
                                          <label className={ 'form-check-label' + (errors.acceptTerms && touched.acceptTerms? ' text-danger': '') }>
                                            I certify that I am 18 years of age or older, and agree to the <a href='#' className='text-primary'>User Agreement</a> and <a href='#' className='text-primary'>Privacy Policy</a>.
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='mt-3 d-grid gap-2'>
                                      <button type='submit' className='btn btn-primary mr-2' disabled={!isValid || isSubmitting}>
                                        {isSubmitting ? 'Loading..' : `Sign Up Now` }
                                      </button>
                                    </div>
                                    <div className='mt-3 d-grid gap-2'>
                                      <button typeof='button' className='button btn btn-danger' type='button' onClick={disconnect}>
                                        Disconnect {address?.substring(0, 5)} ... {address?.substring(address.length - 5, address.length)}
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
                      </>
                    )}
                      
                  </div>
                </div>
                <div className='text-center'>
                  {errorMessage && <h4 className='text-danger'>{errorMessage}</h4>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </GoogleReCaptchaProvider>
  )
}

export default App;