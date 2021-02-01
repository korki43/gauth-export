export interface MigrationPayloadType {
  otpParameters: OtpParameters[];
  version: number;
  batchSize: number;
  batchIndex: number;
  batchId: number;
}

export enum Algorithm {
  ALGORITHM_UNSPECIFIED,
  ALGORITHM_SHA1,
  ALGORITHM_SHA256,
  ALGORITHM_SHA512,
  ALGORITHM_MD5,
}

export enum DigitCount {
  DIGIT_COUNT_UNSPECIFIED,
  DIGIT_COUNT_SIX,
  DIGIT_COUNT_EIGHT,
}

export enum OtpType {
  OTP_TYPE_UNSPECIFIED,
  OTP_TYPE_HOTP,
  OTP_TYPE_TOTP,
}

export interface OtpParameters {
  secret: Uint8Array;
  name: string;
  issuer: string;
  algorithm: Algorithm;
  digits: DigitCount;
  type: OtpType;
  counter: number;
}
