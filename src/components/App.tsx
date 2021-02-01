import { useState } from 'react';
import { Container } from 'react-bootstrap';
import LinkOutput from './LinkOutput';
import QrInput from './QrInput';

const App: React.FC = () => {
  const [otpURIs, setOtpURIs] = useState<string[]>([]);
  return (
    <div className='vh-100 d-flex flex-column justify-content-between'>
      <Container className='mt-4'>
        <h1>Google Authenticator Migrator</h1>
        <p className='lead'>
          Transform your Google Authenticator Exports to standard <i>otpauth</i>{' '}
          links which other OTP Managers can use.
        </p>
        <QrInput setOtpURIs={setOtpURIs} />
        {otpURIs.length ? <LinkOutput otpURIs={otpURIs} /> : null}
      </Container>
      <footer className='bg-light py-3 px-5 text-muted small'>
        <div className='d-flex justify-content-between align-items-center'>
          <span>
            Copyright &copy; 2021 korki /{' '}
            <a href='https://github.com/korki43/gauth-export/blob/main/LICENSE'>
              MIT License
            </a>
          </span>

          <a href='https://github.com/korki43/gauth-export'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='gh-icon'
              viewBox='0 0 16 16'
            >
              <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z' />
            </svg>
          </a>
          <span>No liability or warranty granted.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
