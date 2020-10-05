import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  GridProps,
  IconButton,
  LinearProgress,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';

import { useFormikContext, useField } from 'formik';
import {
  defaultPresignEndPoint,
  useSecureFileUrl,
  useUploadFile
} from '@sierralabs/react-material-ui';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  /* align-items: stretch; */
  .inline-image-container {
    position: relative;
    border: solid 1px #ccc;
    border-radius: 4px;
    display: flex;
    flex: 1;
    min-height: 96px;
    .image-wrapper {
    }
    img {
      position: absolute;
      object-fit: contain;
      width: 90%;
      height: 90%;
    }
    button {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export interface InlineImageProps {
  name: string;
  label: string;
  s3Path: string;
  height?: number;
  grid?: GridProps;
  title?: string;
  description?: string;
  disabled?: boolean;
}

export const InlineImage: React.FC<InlineImageProps> = ({
  name,
  label,
  s3Path,
  height,
  grid,
  title,
  description,
  disabled
}) => {
  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }
  const [open, setOpen] = useState(false);
  const formik = useFormikContext();
  const [field, meta, { setValue, setTouched }] = useField(name);
  const secureUrl = useSecureFileUrl(field.value);
  return (
    <StyledGrid item className='inline-text-field' {...grid}>
      <Typography variant='h5' gutterBottom>
        {label}
      </Typography>
      <div className='inline-image-container'>
        <Button
          variant='text'
          color='primary'
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          {secureUrl ? (
            <img src={secureUrl} alt={field.value} className='image' />
          ) : (
            'Upload Image'
          )}
        </Button>
      </div>
      <InlineImageDialog
        value={secureUrl}
        open={open}
        s3Path={s3Path}
        onCancel={() => setOpen(false)}
        onUploaded={url => {
          console.log('InlineImage.handleSubmit');
          setOpen(false);
          setValue(url);
          setTouched(true);
          formik.submitForm();
        }}
        title={title}
        description={description}
      />
    </StyledGrid>
  );
};

export default InlineImage;

const StyledDragArea = styled.div`
  position: relative;
  height: 300px;
  border: solid 1px #ccc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:hover {
    .overlay-bar {
      opacity: 1;
    }
  }
  .or-text {
    margin: 10px 0;
  }
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  .overlay-bar {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 5px 10px;
    align-items: center;
    transition: 300ms;
    .meta-data {
      flex: 1;
    }
    button {
      margin-right: 5px;
    }
  }
`;

const StyledOverlayButton = styled(Button)`
  border: 1px solid #fff;
  color: #fff;
`;

const StyledOverlayIconButton = styled(IconButton)`
  color: #fff;
`;

export interface InlineImageDialogProps {
  value?: string;
  s3Path: string;
  open: boolean;
  onCancel: () => void;
  onUploaded: (url: string) => void;
  title?: string;
  description?: string;
}
export const InlineImageDialog: React.FC<InlineImageDialogProps> = ({
  value,
  s3Path,
  open,
  onCancel,
  onUploaded,
  title,
  description
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onUploadedRef = useRef(onUploaded);
  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState(value);
  const { uploadedFile, isUploading, progress, error, upload } = useUploadFile(
    s3Path,
    defaultPresignEndPoint
  );

  useEffect(() => {
    if (uploadedFile?.url && progress === 1 && !isUploading) {
      onUploadedRef.current(uploadedFile.url);
    }
  }, [uploadedFile, isUploading, progress]);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const dataUrl = await readImageFile(file);
      setFile(file);
      setImageUrl(dataUrl);
      // const image = await loadImageUri(dataUrl);
    }
  };
  const handleClear = () => {
    setFile(undefined);
    setImageUrl(undefined);
  };
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title || 'Upload Image'}</DialogTitle>
      {description && <DialogContent>{description}</DialogContent>}
      <DialogContent>
        <StyledDragArea>
          {imageUrl ? (
            <Fragment>
              <img src={imageUrl} alt='selected file to upload' />
              <div className='overlay-bar'>
                <div className='meta-data'>
                  File Size: {file?.size.toLocaleString()} bytes
                </div>
                <StyledOverlayButton
                  variant='outlined'
                  size='small'
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change File
                </StyledOverlayButton>
                <StyledOverlayIconButton size='small' onClick={handleClear}>
                  <DeleteIcon />
                </StyledOverlayIconButton>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Typography variant='subtitle2'>Drag a file here</Typography>
              <Typography variant='subtitle2' className='or-text'>
                -- or --
              </Typography>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => fileInputRef.current?.click()}
              >
                Select File
              </Button>
            </Fragment>
          )}
          <input
            hidden
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={handleFile}
          />
        </StyledDragArea>
        {isUploading && (
          <LinearProgress
            color='primary'
            variant='determinate'
            value={progress * 100}
          />
        )}
        {error && (
          <Box mt={2}>
            <Alert severity='error'>
              Error uploading. Please check the internet connection and try
              again.
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant='contained'
          color='primary'
          disabled={!file || isUploading}
          onClick={() => upload(file as File)}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const readImageFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // read file as data url
    reader.addEventListener(
      'load',
      () => resolve(reader.result as string),
      false
    );
    reader.addEventListener(
      'error',
      error => {
        reject(error);
      },
      false
    );
  });
};

const loadImageUri = (imageUri: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = imageUri;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = error => {
      reject(error);
    };
  });
};
