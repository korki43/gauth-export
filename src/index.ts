import './style/main.scss';

import { readImageFromFile } from './decode/readImageFile';
import QrScanner from 'qr-scanner';
import { decodeMigrationUrl } from './decode/decodeUrl';
import { getOtpAuthUris } from './decode/getOtpURIs';
import { MDCTextField } from '@material/textfield';

const migrationURIField = document.querySelector<HTMLLabelElement>('.migration-uri-field');
let textField: MDCTextField | null = null;
if(migrationURIField) {
  textField = MDCTextField.attachTo(migrationURIField);
}

const form = document.querySelector('form') as HTMLFormElement;
const qrFileInput = form.querySelector<HTMLInputElement>('input#qr-file-input');
const qrFileLabel = form.querySelector<HTMLDivElement>('div#qr-file-label');
const migrationURIInput = form.querySelector<HTMLInputElement>('input#migration-uri') ;
const errorBox = document.querySelector<HTMLParagraphElement>('#error-box');
const uriList = document.querySelector<HTMLDivElement>('#uri-list') ;
const uriListContainer = document.querySelector<HTMLHeadingElement>('#uri-list-container');
const uriDownloadLink = document.querySelector<HTMLAnchorElement>('#uris-download-link');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if(!migrationURIInput) { return; }
  processMigrationURI(migrationURIInput.value);
});

if(migrationURIInput) {
  migrationURIInput.addEventListener('focusout', () => {
    processMigrationURI(migrationURIInput.value);
  });
}

if(qrFileInput) {
  qrFileInput.addEventListener('change', async (e: Event) => {
    try {
      if(errorBox) {
        errorBox.classList.add('hidden');
        errorBox.innerText = ''; 
      }
  
      const input = e.target as HTMLInputElement;
  
      if(!input || !input.files?.length) {
        throw new Error("Couldn't read QR code");
      }
  
      const file = input.files[0];
      if(qrFileLabel) {
        qrFileLabel.innerText = file.name;
      }

      const imgData = await readImageFromFile(file);
      const data = await QrScanner.scanImage(imgData, { 
        scanRegion: {
          width: imgData.width, 
          height: imgData.height 
        }
      });

      if(textField) {
        textField.value = data.data;
      }

      processMigrationURI(data.data);
    } catch (e) {
      const errorString = e instanceof Error ? e.message : e;
      console.error(errorString);
      if(errorBox) {
        errorBox.classList.remove('hidden');
        errorBox.innerText = errorString;
        return;
      }
    }
  });
}

function processMigrationURI(uri: string): void {
  while (uriList?.firstChild) {
    uriList.firstChild.remove();
  }

  if(!uri) {
    return;
  }

  uriList?.classList.remove('hidden');
  uriListContainer?.classList.add('hidden');

  if(errorBox) {
    errorBox.classList.add('hidden');
    errorBox.innerText = ''; 
  }

  try {
    const otpExportData = decodeMigrationUrl(uri);
    const uris = getOtpAuthUris(otpExportData.otpParameters);
    if(!uris.length) { 
      throw new Error('No otpauth URIs in migration URI');
    }

    uriListContainer?.classList.remove('hidden');

    const downloadButton = document.querySelector<HTMLButtonElement>('#download-export');

    if(downloadButton) {
      uriDownloadLink?.classList.add('hidden');
      downloadButton?.addEventListener('click', (e: Event) => {
        e.preventDefault();
        uriDownloadLink?.click();
      });
    }

    if(uriDownloadLink) {
      uriDownloadLink.href = `data:text/plain;base64,${btoa(uris.join('\n'))}`;
      uriDownloadLink.download = `gauth-export-${Date.now()}.txt`;
    }

    if(!uriList) { return; }

    for(const uri of uris) {
      const listElement = document.createElement('div');
      listElement.classList.add('list-group-item');
      const innerElement = document.createElement('code');
      innerElement.innerText = uri;
      listElement.appendChild(innerElement);
      uriList?.appendChild(listElement);
    }
  } catch (e) {
    const errorString = e instanceof Error ? e.message : e;
    if(errorBox) {
      errorBox.classList.remove('hidden');
      errorBox.innerText = errorString;
    }
    console.error(errorString);
  }
}
