import protobuf from 'protobufjs';
import { MigrationPayloadMessageProto } from './MigrationPayloadMessage';
import { MigrationPayloadType } from './MigrationPayload';

export function decodeMigrationUrl(migrationUrl: string): MigrationPayloadType {
  const payload = new URL(migrationUrl).searchParams.get('data');
  if (!payload) {
    throw new SyntaxError('Given URI contains no payload.');
  }
  const buffer = new Uint8Array(protobuf.util.base64.length(payload));
  protobuf.util.base64.decode(payload, buffer, 0);

  const { root } = protobuf.parse(MigrationPayloadMessageProto);
  const MigrationPayloadMsg = root.lookupType('MigrationPayload');

  const decodedMessage = MigrationPayloadMsg.decode(buffer, buffer.byteLength);

  return MigrationPayloadMsg.toObject(decodedMessage, {
    enums: Number,
    bytes: Uint8Array,
    defaults: true,
  }) as MigrationPayloadType;
}
