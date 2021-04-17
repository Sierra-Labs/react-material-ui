import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '../lib';
import { useApiPost } from './Api.hooks';

export interface FilePresignedDto {
  file: File;
  destinationUrl: string;
  signedUrl: string;
  expiration: number;
}

export const defaultPresignEndPoint = 'files/presign';

export function useSecureFileUrl(url?: string) {
  if (url) {
    return `${url}&token=${api.getAccessToken()}`;
  }
}

export function useUploadFile(
  path: string,
  presignEndPoint = defaultPresignEndPoint
) {
  const {
    presignedResult,
    isLoading: isLoadingPresignedUrl,
    error: presignedError,
    presignUrl
  } = useCreatePresignedUrl(path, presignEndPoint);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string>();
  const [file, setFile] = useState<File>();
  const [response, setResponse] = useState<Response>();
  const [error, setError] = useState<Response>();
  const [isUploading, setIsUploading] = useState(false);
  const requestRef = useRef(new XMLHttpRequest());

  useEffect(() => {
    const request = requestRef.current;
    if (!isLoadingPresignedUrl && presignedResult && file) {
      request.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          setProgress(event.loaded / event.total);
        }
      });

      request.upload.addEventListener('load', event => {
        setProgress(1);
        setIsUploading(false);
        setFileUrl(presignedResult?.destinationUrl);
        setResponse(request.response);
      });

      request.upload.addEventListener('error', event => {
        setError(request.response);
        setIsUploading(false);
        setProgress(0);
      });
      request.open('PUT', presignedResult.signedUrl);
      request.setRequestHeader('Content-Type', file.type);
      request.responseType = 'text';
      request.send(file);
      return () => request.abort();
    }
  }, [file, isLoadingPresignedUrl, presignedResult]);
  const upload = useCallback(
    (file: File) => {
      setIsUploading(true);
      setProgress(0);
      setFile(file);
      presignUrl(file.type);
    },
    [presignUrl]
  );
  return {
    fileUrl,
    uploadedFile: file,
    isUploading,
    progress,
    response,
    error: error || presignedError,
    upload
  };
}

export interface UploadFile {
  file: File;
  progress: number;
  isUploading: boolean;
  request: XMLHttpRequest;
  isCompleted?: boolean;
  isError?: boolean;
  presignedResult?: FilePresignedDto;
}

export function useUploadFiles(
  path: string,
  presignEndPoint = defaultPresignEndPoint
) {
  let {
    presignedResults,
    error: presignedError,
    presignUrls
  } = useCreatePresignedUrls(path, presignEndPoint);
  let fileIndexRef = useRef(0);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>();
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(
    (fileList: FileList | File[]) => {
      setIsUploading(true);
      const files: UploadFile[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const uploadFile = {
          file: fileList[i],
          progress: 0,
          isUploading: true,
          request: new XMLHttpRequest(),
          isCompleted: false,
          isError: false
        };

        files.push(uploadFile);
      }
      // start upload (see first useEffect)
      setUploadFiles([...(uploadFiles || []), ...files]);
      presignUrls(files.map(u => u.file));
    },
    [presignUrls, uploadFiles]
  );

  // remove an upload file and abort if uploading
  const remove = useCallback(
    (file: File) => {
      if (uploadFiles) {
        const index = uploadFiles.findIndex(f => f.file === file);
        if (index > -1) {
          uploadFiles[index].request.abort();
          uploadFiles.splice(index, 1);
          if (index <= fileIndexRef.current) {
            fileIndexRef.current--;
          }
          setUploadFiles([...uploadFiles]);
        }
      }
    },
    [uploadFiles]
  );

  // get pre-signed url for files
  useEffect(() => {
    if (uploadFiles && fileIndexRef.current < uploadFiles.length) {
      // find presigned url matching the file to upload
      const uploadFile = uploadFiles[fileIndexRef.current];
      const presignedResult = presignedResults.find(
        p => p.file === uploadFile.file
      );
      if (!presignedResult) return; // have not yet received presigned url
      uploadFile.presignedResult = presignedResult;
      // console.log('presigned received uploadFile', uploadFiles);
      setUploadFiles([...uploadFiles]);
      fileIndexRef.current++;
      // Perform Upload
      uploadFile.request.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          uploadFile.progress = event.loaded / event.total;
          // console.log('uploadFile progress');
          setUploadFiles([...uploadFiles]);
        }
      });
      uploadFile.request.upload.addEventListener('load', event => {
        uploadFile.progress = 1;
        uploadFile.isUploading = false;
        uploadFile.isCompleted = true;
        // console.log('uploadFile load completed');
        setUploadFiles([...uploadFiles]);
      });
      uploadFile.request.upload.addEventListener('error', event => {
        uploadFile.progress = 0;
        uploadFile.isUploading = false;
        uploadFile.isError = true;
        // console.log('uploadFile error');
        setUploadFiles([...uploadFiles]);
      });
      uploadFile.request.open('PUT', uploadFile.presignedResult.signedUrl);
      uploadFile.request.setRequestHeader('Content-Type', uploadFile.file.type);
      uploadFile.request.responseType = 'text';
      uploadFile.request.send(uploadFile.file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presignUrls, presignedResults]);

  useEffect(() => {
    // abort upload requests when unmounted
    return () => {
      // console.log('uploadfiles ABORT');
      if (uploadFiles) {
        uploadFiles.forEach(uploadFile => uploadFile.request.abort());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    uploadFiles,
    isUploading,
    error: presignedError,
    upload,
    remove
  };
}

/**
 * Get a single presigned url
 */
export function useCreatePresignedUrl(
  path: string,
  presignEndPoint = defaultPresignEndPoint
) {
  const { isLoading, post, data, error } = useApiPost<FilePresignedDto>(
    `${presignEndPoint}/${path}`
  );
  const presignUrl = useCallback(
    (mimeType: string) => {
      post({ mimeType });
    },
    [post]
  );
  return { presignedResult: data, isLoading, error, presignUrl };
}

/**
 * Support getting multiple presigned urls for bulk uploading
 */
export function useCreatePresignedUrls(
  path: string,
  presignEndPoint = defaultPresignEndPoint
) {
  const { isLoading, post, data, error } = useApiPost<FilePresignedDto>(
    `${presignEndPoint}/${path}`
  );
  const filesRef = useRef<File[]>([]);
  const nextIndexRef = useRef(0);
  const [presignedResults, setPresignedResults] = useState<FilePresignedDto[]>(
    []
  );

  const presignUrls = useCallback(
    (files?: File[]) => {
      if (files) {
        // add files to get presigned urls
        filesRef.current.push(...files);
      }
      // get presigned url for next item in queue
      if (nextIndexRef.current < filesRef.current.length && !isLoading) {
        // console.log(
        //   'presignedUrls',
        //   nextIndexRef.current,
        //   filesRef.current[nextIndexRef.current]
        // );
        post({ mimeType: filesRef.current[nextIndexRef.current].type });
      }
    },
    [isLoading, post]
  );

  useEffect(() => {
    // check if presigned url has returned and proceed to next file
    if (data && !isLoading) {
      const file = filesRef.current[nextIndexRef.current];
      setPresignedResults([...presignedResults, { ...data, file }]);
      nextIndexRef.current++;
      presignUrls(); // process next file
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  return { presignedResults, isLoading, error, presignUrls };
}
