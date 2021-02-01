import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { decodeMigrationUrl } from '../domain/decodeUrl';
import { getOtpAuthUris } from '../domain/getOtpURIs';

interface Props {
  migrationUrl: string;
}

const LinkOutput: React.FC<Props> = ({ migrationUrl }) => {
  const [otpURIs, setOtpURIs] = useState<string[]>([]);
  useEffect(() => {
    const otpExportData = decodeMigrationUrl(migrationUrl);
    const uris = getOtpAuthUris(otpExportData.otpParameters);
    setOtpURIs(uris);
  }, [migrationUrl]);

  return (
    <ListGroup className='mb-3'>
      {otpURIs.map((otpURI) => (
        <ListGroup.Item>
          <code>{otpURI}</code>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default LinkOutput;
