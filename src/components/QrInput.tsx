import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { readImageFromFile } from '../domain/readImageFile';
import jsQR from 'jsqr';
import { decodeMigrationUrl } from '../domain/decodeUrl';
import { getOtpAuthUris } from '../domain/getOtpURIs';
interface Props {
  setOtpURIs: (u: string[]) => void;
}

const QrInput: React.FC<Props> = ({ setOtpURIs }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <Form>
      <Form.File
        custom
        className={error ? 'is-invalid' : 'mb-3'}
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          try {
            setError(null);
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
              const imgData = await readImageFromFile(e.target.files[0]);
              const migrationURI = jsQR(
                imgData.data,
                imgData.width,
                imgData.height
              );
              if (migrationURI) {
                const otpExportData = decodeMigrationUrl(migrationURI.data);
                const uris = getOtpAuthUris(otpExportData.otpParameters);
                setOtpURIs(uris);
              } else {
                throw new Error("Couln't read QR code");
              }
            }
          } catch (e) {
            setError(e.message);
          }
        }}
        label={file?.name || 'Upload your QR code here.'}
      />
      <div className='invalid-feedback mb-3'>{error}</div>
    </Form>
  );
};

export default QrInput;
