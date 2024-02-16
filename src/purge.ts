
import fetch from 'node-fetch';
import { info } from '@actions/core';

function purgeZone(zoneId: string, zoneKey: string) {

  return fetch(`https://api.bunny.net/pullzone/${zoneId}/purgeCache`, {
    method: 'POST',
    headers: {
      "AccessKey": zoneKey,
    }
  }).then(response => {
    if (response.status === 204) {
      info('The cache was successfuly purged');
    }else if (response.status === 401) {
      info('The request authorization failed');
    }else if (response.status === 404) {
      info('The Pull Zone with the requested ID does not exist');
    } else {
      throw new Error(`Error purging cache ${response.status}.`);
    }
    return response;
  });
}

export default async function run( zoneId: string, zoneKey: string): Promise<void> {

    await purgeZone( zoneId, zoneKey);

}
