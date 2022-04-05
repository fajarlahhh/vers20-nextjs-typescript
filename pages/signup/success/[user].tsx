import React from 'react';/* eslint-disable react/jsx-key */
import Image from 'next/image';
import Link from 'next/link';

const App = () => {
  return (
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
                    <div className='text-center'>
                      <h4 className='text-warning'>Sign up in progress</h4>
                      <small>Dont close this tab or close your browser!!!</small>
                      <hr />
                      <strong>{progress}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </>
  )
}

export default App;
