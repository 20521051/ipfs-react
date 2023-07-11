import React, { useState, useCallback, useRef, useEffect } from 'react';

import { Header, Footer } from '~/components/ui';
import * as IPFS from 'ipfs-core';
//0x09Cb77ba7ad5Cc937E8E6b7Ec71b165eada3bfdF
//QmQxGMaZTK1gvCh7G7PGnnW4qFTYfftr7pVPNFUdX7nrNq/CV_NguyenDinhKhai_ENG.pdf

function App() {
  const [uris, setUris] = useState<string[]>([]);
  const [upload, setUpload] = useState<string>('');
  const [file, setFile] = useState<File>();
  const formattedUris = uris.map((uri) => uri.replace('ipfs://', 'gateway.ipfscdn.io/ipfs/'));
  const [hash, setHash] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const hashRef = useRef<HTMLInputElement>(null);
  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileInput = () => {
    const file = inputRef.current?.files?.[0];
    if (file) {
      setUpload(URL.createObjectURL(file));
      setFile(file);
    }
  };
  const handleCheck = () => {
    if (hashRef.current) setHash(hashRef.current.value);
  };
  const save = async () => {
    const ipfsService = await IPFS.create();
    ipfsService.add({
      path: upload,
      content: 'save'
    });
  };
  const getByHash = async () => {
    const ipfsService = await IPFS.create();
    const asyncitr = ipfsService.cat(hash);

    for await (const itr of asyncitr) {
      const data = Buffer.from(itr).toString();
      return data;
    }
  };
  useEffect(() => {
    save();
  }, [upload]);
  return (
    <>
      <Header />
      <div className='m-10'>
        <div className='flex items-center my-8'>
          <form className='flex items-center'>
            <p className='font-bold'>Chọn file:</p>
            <div className='ml-3'>
              <input
                type='file'
                // accept='file_extension'
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
              <button
                title='Chọn tệp'
                className='px-2 py-3 text-heading-10 text-teal-500 border-2 border-teal-500'
                onClick={handleChooseFile}
              >
                Chọn tệp
              </button>
            </div>
          </form>
          {/* hiện nếu chọn file*/}
          {formattedUris && (
            <div>
              {formattedUris.map((uri, index) => (
                <p key={index}>{uri}</p>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className='font-bold mb-4'>Nhập mã hash:</p>
          <div>
            <input
              type='text'
              placeholder='hash'
              ref={hashRef}
              className='w-[500px] py-3 text-heading-10 border-2 border-teal-500 w-[300px]'
            />
            <button
              title='Kiểm tra'
              className='px-2 py-3 text-heading-10 text-teal-500 border-2 border-teal-500 ml-8'
              onClick={handleCheck}
            >
              Kiểm tra
            </button>
          </div>
        </div>
      </div>
      <div className='m-10'>
        <p className='font-bold'>
          Kết quả:{' '}
          {formattedUris && (
            <div>
              {formattedUris.map((uri, index) => (
                <p key={index}>{uri}</p>
              ))}
            </div>
          )}
        </p>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;
