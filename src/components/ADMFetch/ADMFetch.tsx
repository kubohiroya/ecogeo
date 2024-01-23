import { Button, debounce } from '@mui/material';
import { useCallback } from 'react';

const download = async (url: string) => {
  const res = await fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  );
  const body = await res.text();
  return body;
};

export const ADMFetch = () => {
  const onClick = useCallback(async () => {
    const body = await download('https://gadm.org/maps.html');
    const matches = body.match(/maps\/(?<iso>\w\w\w)\.html/g);
    if (matches === null) throw new Error('countries is null');
    const countries = matches.map((match) => match.slice(5, 8));
    console.log(countries);

    const exclude = [
      'ABW',
      'ATA',
      'BVT',
      'CXR',
      'FLK',
      'GIB',
      'IOT',
      'KIR',
      'MCO',
      'MDV',
      'NFK',
      'NIU',
      'PCN',
      'VAT',
    ];

    //await Promise.all(
    countries.map(async (country) => {
      const jsonResponse = debounce(
        () => {
          console.log(
            `https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_0.json`,
          );
        },
        /*
        await download(
          `https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_0.json`,
        ),*/
        1000,
      );
      // zip
      // store into indexeddb
    }),
      //);

      //await Promise.all(
      countries
        .filter((country) => !exclude.includes(country))
        .map(async (country) => {
          const jsonResponse = debounce(
            () => {
              console.log(
                `https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_1.json.zip`,
              );
            },
            /*
            await download(
              `https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_1.json.zip`,
            ),
             */
            1000,
          );
          // store into indexeddb
        });
    //);
  }, []);
  return (
    <Button variant={'outlined'} onClick={onClick}>
      Download ADM Files
    </Button>
  );
};
