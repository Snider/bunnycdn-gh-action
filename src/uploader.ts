import fs from 'fs';
import fetch from 'node-fetch';
import readdirp from 'readdirp';
import { info } from '@actions/core';

function uploadFile(entry: readdirp.EntryInfo, storageName: string, accessKey: string) {
  const readStream = fs.createReadStream(entry.fullPath);
  info(`Deploying ${entry.path}`);
  return fetch(`https://storage.bunnycdn.com/${storageName}/${entry.path}`, {
    method: 'PUT',
    headers: {
      "AccessKey": accessKey,
    },
    body: readStream
  }).then(response => {
    if (response.status === 201) {
      info(`Successfully deployed ${entry.path}`);
    } else {
      throw new Error(`Uploading ${entry.path} has failed width status code ${response.status}.`);
    }
    return response;
  });
}

export default async function run(path: string, storageName: string, accessKey: string): Promise<void> {
  for await (const entry of readdirp(path)) {
    await uploadFile(entry, storageName, accessKey);
  }
}
