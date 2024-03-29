import { readImageFromFile } from './readImageFile';
import jsQR from 'jsqr';
import { decodeMigrationUrl } from './decodeUrl';
import { getOtpAuthUris } from './getOtpURIs';


const form = document.querySelector('form') as HTMLFormElement;
const qrFileInput = form.querySelector(
  'input#qr-file-input'
) as HTMLInputElement;
const qrFileLabel = form.querySelector(
  'label#qr-file-label'
) as HTMLLabelElement;
const MigrationURIInput = form.querySelector(
  'input#migration-uri'
) as HTMLInputElement;
const errorBox = form.querySelector('p#error-box') as HTMLParagraphElement;
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

qrFileInput.addEventListener('change', async (e: any) => {
  try {
    errorBox.innerText = '';
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      qrFileLabel.innerText = file.name;
      const imgData = await readImageFromFile(file);
      const migrationURI = jsQR(imgData.data, imgData.width, imgData.height);
      if (migrationURI != null) {
        MigrationURIInput.value = migrationURI.data;
        processMigrationURI(migrationURI.data);
      } else {
        throw new Error("Couldn't read QR code");
      }
    }
  } catch (e) {
    errorBox.innerText = e.message;
  }
});

function processMigrationURI(uri: string) {
  if (uri.length == 0) return;
  uriListHeader.classList.add('hidden');
  errorBox.innerText = '';
  while (uriList.firstChild) {
    uriList.firstChild.remove();
  }
  try {
    const otpExportData = decodeMigrationUrl(uri);
    const uris = getOtpAuthUris(otpExportData.otpParameters);
    if (uris.length) {
      uriListHeader.classList.remove('hidden');
      uriDownloadLink.href = `data:text/plain;base64,${btoa(uris.join('\n'))}`;
      uriDownloadLink.download = `gauth-export-${Date.now()}.txt`;
      console.log(uriDownloadLink);
      uris.forEach((uri) => {
        const listElement = document.createElement('div');
        listElement.classList.add('list-group-item');
        const innerElement = document.createElement('code');
        innerElement.innerText = uri;
        listElement.appendChild(innerElement);
        uriList.appendChild(listElement);
      });
    } else {
      throw new Error('No otpauth URIs in migration URI');
    }
  } catch (e) {
    errorBox.innerText = e.message;
  }
}
