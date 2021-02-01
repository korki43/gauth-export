import { ListGroup } from 'react-bootstrap';

interface Props {
  otpURIs: string[];
}

const LinkOutput: React.FC<Props> = ({ otpURIs }) => {
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
