import './style/main.scss';

import { readImageFromFile } from './decode/readImageFile';
import QrScanner from 'qr-scanner';
import { decodeMigrationUrl } from './decode/decodeUrl';
import { getOtpAuthUris } from './decode/getOtpURIs';

const form = document.querySelector('form') as HTMLFormElement;
const qrFileInput = form.querySelector(
  'input#qr-file-input'
) as HTMLInputElement;
const qrFileLabel = form.querySelector(
  'div#qr-file-label'
) as HTMLLabelElement;
const MigrationURIInput = form.querySelector(
  'input#migration-uri'
) as HTMLInputElement;
const errorBox = form.querySelector('#error-box') as HTMLParagraphElement;
const uriList = document.querySelector('#uri-list') as HTMLDivElement;
const uriListHeader = document.querySelector(
  '#uri-list-header'
) as HTMLHeadingElement;
const uriDownloadLink = document.querySelector(
  '#uris-download-link'
) as HTMLAnchorElement;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  processMigrationURI(MigrationURIInput.value);
});

MigrationURIInput.addEventListener('focusout', () => {
  processMigrationURI(MigrationURIInput.value);
});

qrFileInput.addEventListener('change', async (e: Event) => {
  try {
    errorBox.innerText = '';

    const input = e.target as HTMLInputElement;

    if(!input || !input.files?.length) {
      throw new Error("Couldn't read QR code");
    }

    const file = input.files[0];
    qrFileLabel.innerText = file.name;
    const imgData = await readImageFromFile(file);
    const data = await QrScanner.scanImage(imgData, { 
      scanRegion: {
        width: imgData.width, 
        height: imgData.height 
      }
    });

    while (uriList.firstChild) {
      uriList.firstChild.remove();
    }

    MigrationURIInput.value = data.data;
    processMigrationURI(data.data);
  } catch (e) {
    errorBox.innerText = e instanceof Error ? e.message : e;
  }
});

function processMigrationURI(uri: string): void {
  if(!uri) {
    return;
  }

  uriListHeader.classList.add('hidden');
  errorBox.innerText = '';

  try {
    const otpExportData = decodeMigrationUrl(uri);
    const uris = getOtpAuthUris(otpExportData.otpParameters);
    if(!uris.length) { 
      throw new Error('No otpauth URIs in migration URI');
    }

    uriListHeader.classList.remove('hidden');
    uriDownloadLink.href = `data:text/plain;base64,${btoa(uris.join('\n'))}`;
    uriDownloadLink.download = `gauth-export-${Date.now()}.txt`;

    for(const uri of uris) {
      const listElement = document.createElement('div');
      listElement.classList.add('list-group-item');
      const innerElement = document.createElement('code');
      innerElement.innerText = uri;
      listElement.appendChild(innerElement);
      uriList.appendChild(listElement);
    }
  } catch (e) {
    errorBox.innerText = e instanceof Error ? e.message : e;
  }
}
