# Web5 in 5️⃣ Minutes

Let's build a decentralized application on the Web5 platform - in under 5 minutes. You will learn how to:

✅ Create unique digital IDs for users known as Decentralized Identifiers (DIDs)

✅ Issue and manage digital proofs using Verifiable Credentials (VCs)

✅ Store and read data from your users' personal data store called a Decentralized Web Node (DWN)

Let’s go! 🚀

## Installation

### Prerequisites

- Node Package Manager, npm, installed and on your system's $PATH.
- Node version 18 and above

### Steps

1. **Create a directory**

    This will be the home of your new Web5 app. Run the following commands in your CLI:
    ```bash
    mkdir web5-app
    cd web5-app
    ```

2. **Install Web5**

    Use NPM to initialize a package.json file:
    ```bash
    npm init -y
    ```

    Use NPM to install Web5:
    ```bash
    npm install @web5/api@0.9.4
    npm install @web5/credentials@1.0.1
    ```

    These steps will create a package.json in the root of your project. Open the newly created package.json and add `module` as a type:
    ```json
    {
      "dependencies": {
        "@web5/api": "0.9.4",
        "@web5/credentials": "1.0.1"
      },
      "type": "module"
    }
    ```

3. **Create App File**

    Create an `index.js` file where you will write all of your application logic:
    ```bash
    touch index.js
    ```

    For Windows using PowerShell:
    ```powershell
    New-Item index.js -ItemType File
    ```

    > NOTE: After npm resolves the dependency, you may see a few warnings. You can ignore these for now.

4. **Import Web5**

    At the top of your `index.js` file, add these lines to import the Web5 package dependencies that you will use to build your application:
    ```javascript
    import { Web5 } from '@web5/api';
    import { VerifiableCredential } from '@web5/credentials';

    import { webcrypto } from 'node:crypto';

    if (!globalThis.crypto) globalThis.crypto = webcrypto;
    ```

    Now that you've installed the Web5 SDKs, you are ready to start building!

## Create Web5 App

1. **Instantiate Web5 and Create DID**

    In Web5 apps, a user’s unique identifier - like an email address - is called a Decentralized Identifier (DID). We are building a decentralized app, so your users are using identifiers that aren't tied to a centralized authority.

    The Web5 class is an isolated API object for doing all things Web5. The `connect()` function creates an instance of Web5 and also creates a decentralized identifier or obtains connection to an existing one.

    In `index.js` below the import statement, create a new instance of Web5:
    ```javascript
    const { web5, did: aliceDid } = await Web5.connect({ password: 'your-secure-password' });
    console.log(`Created DID: ${aliceDid}`);
    ```

    This Web5 instance is what you'll use to access the other objects of Web5 such as DWN.

    Run your code:
    ```bash
    node index.js
    ```

2. **Access Bearer DID**

    In the previous step, you generated what is known as a (DID), which appears as an alphanumeric string. It's more specifically referred to as a DID URI.

    To access your Bearer DID, add the following lines of code to your `index.js`:
    ```javascript
    const { did: aliceBearerDid } = await web5.agent.identity.get({ didUri: aliceDid });
    console.log(`Bearer DID: ${aliceBearerDid}`);
    ```

3. **Create a VC**

    Verifiable Credentials (VCs) are digital proofs used to confirm specific facts about individuals, organizations, or entities. In this step, you'll enable your users to create a self-signed VC -- allowing them to issue a Verifiable Credential that makes claims about themselves.

    In your `index.js`, create your Verifiable Credential:
    ```javascript
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
    ```

4. **Sign VC**

    Now, your users can sign the VC with their Bearer DID to ensure its authenticity and integrity.

    To allow users to sign a VC, add this line to your `index.js`:
    ```javascript
    const signedVc = await vc.sign({ did: aliceBearerDid });
    console.log(`Signed VC (JWT): ${signedVc}`);
    ```

5. **Store VC in DWN**

    Your users can now store the JWT form of their VC in a DWN (Decentralized Web Node).

    To store a VC in a DWN, add the following lines of code to your `index.js`:
    ```javascript
    const { record } = await web5.dwn.records.create({
      data: signedVc,
      message: {
        schema: 'Web5QuickstartCompletionCredential',
        dataFormat: 'application/vc+jwt',
        published: true
      }
    });
    console.log('Stored VC in DWN');
    ```

6. **Read VC from DWN**

    If the user has given your app read permissions to their DWN, you can read their data by accessing it through the `record` property.

    To read the JWT-encoded VC stored in your DWN, add the following to your `index.js`:
    ```javascript
    const readSignedVc = await record.data.text();
    console.log(`Read VC from DWN: ${readSignedVc}`);
    ```

7. **Parse VC**

    Upon receiving a Verifiable Credential (VC) as a JSON Web Token (JWT), applications can convert it back to JSON format using the `VerifiableCredential.parseJwt()` method.

    Add the following line to your `index.js` to parse the JWT-encoded VC:
    ```javascript
    const parsedVc = VerifiableCredential.parseJwt({ vcJwt: readSignedVc });
    console.log(`Parsed VC: ${JSON.stringify(parsedVc, null, 2)}`);
    ```

## Summary

Congrats! You've successfully created an application with two key functionalities:

1. Issuing and cryptographically signing Verifiable Credentials, providing users with a reliable way to verify facts about individuals, organizations, or entities.
2. Creating a local Decentralized Web Node (DWN) as a personal data store for users. With their DID and appropriate permissions, your app can read, write, or delete data from the user's DWN, ensuring they have full control over their content.