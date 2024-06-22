import { Web5 } from '@web5/api';
import { VerifiableCredential } from '@web5/credentials';
import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) globalThis.crypto = webcrypto;

(async () => {
  try {
    const { web5, did: aliceDid } = await Web5.connect({
      // Example configuration object, adjust as necessary
      password: 'your-secure-password'
    });

    console.log(`Created DID: ${aliceDid}`);

    const { did: aliceBearerDid } = await web5.agent.identity.get({ didUri: aliceDid });

    console.log(`Bearer DID: ${aliceBearerDid}`);

    const vc = await VerifiableCredential.create({
      type: 'Web5QuickstartCompletionCredential',
      issuer: aliceDid,
      subject: aliceDid,
      data: {
        name: 'Alice Smith',
        completionDate: new Date().toISOString(),
        expertiseLevel: 'Beginner'
      }
    });

    console.log(`Created VC: ${JSON.stringify(vc, null, 2)}`);

    const signedVc = await vc.sign({ did: aliceBearerDid });

    console.log(`Signed VC (JWT): ${signedVc}`);

    const { record } = await web5.dwn.records.create({
      data: signedVc,
      message: {
        schema: 'Web5QuickstartCompletionCredential',
        dataFormat: 'application/vc+jwt',
        published: true
      }
    });

    console.log('Stored VC in DWN');

    const readSignedVc = await record.data.text();

    console.log(`Read VC from DWN: ${readSignedVc}`);

    const parsedVc = VerifiableCredential.parseJwt({ vcJwt: readSignedVc });

    console.log(`Parsed VC: ${JSON.stringify(parsedVc, null, 2)}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();