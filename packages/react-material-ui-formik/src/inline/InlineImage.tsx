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

export enum InlineImageFit {
  Fill = 'fill',
  Contain = 'contain',
  Cover = 'cover'
}

export interface InlineImageResize {
  // if `width` is specified all images will be resized to this width.
  width?: number;
  // if `height` is specified all images will be resized to this height.
  height?: number;
  // if `maxWidth` is specified all images will not exceed this width.
  // This property should not be used in conjunction with `width`.
  maxWidth?: number;
  // if `maxHeight` is specified all images will not exceed this height.
  // This property should not be used in conjunction with `height`.
  maxHeight?: number;
  // if `minWidth` is specified all smaller width images will be upscaled to this width.
  // This property should not be used in conjunction with `width`.
  minWidth?: number;
  // if `minHeight` is specified all smaller width images will be upscaled to this height.
  // This property should not be used in conjunction with `height`.
  minHeight?: number;
  // The aspect fit when resizing.
  fit?: InlineImageFit;
  // resize image type (i.e. image/png, image/jpeg). If not specified defaults to same
  // image type from file uploaded.
  type?: string;
  // if resizing jpeg specify the quality (defaults to 0.8)
  quality?: number;
  // warn if uploaded image is smaller than minWidth or minHeight
  warnSmallImage?: boolean;
  // warn if uploaded image aspect ratio is incorrect
  warnAspectRatio?: boolean;
}

export interface InlineImageProps {
  name: string;
  label: string;
  s3Path: string;
  height?: number;
  grid?: GridProps;
  title?: string;
  description?: string;
  disabled?: boolean;
  resize?: InlineImageResize;
}

export const InlineImage: React.FC<InlineImageProps> = ({
  name,
  label,
  s3Path,
  height,
  grid,
  title,
  description,
  disabled,
  resize
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
          setOpen(false);
          setTouched(true);
          // delay URL as S3 take some time to make URL available after
          // upload
          setTimeout(() => {
            setValue(url);
            formik.submitForm();
          }, 300);
        }}
        onClear={() => {
          setOpen(false);
          setValue('');
          setTouched(true);
          formik.submitForm();
        }}
        title={title}
        description={description}
        resize={resize}
      />
    </StyledGrid>
  );
};

export default InlineImage;

const StyledDragArea = styled.div.attrs(props => ({
  color: props.color || 'white'
}))`
  background-color: ${props => props.color};
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
  disabled?: boolean;
  onCancel: () => void;
  onClear: () => void;
  onUploaded: (url: string) => void;
  title?: string;
  description?: string;
  resize?: InlineImageResize;
}
export const InlineImageDialog: React.FC<InlineImageDialogProps> = ({
  value,
  s3Path,
  open,
  disabled,
  onCancel,
  onClear,
  onUploaded,
  title,
  description,
  resize
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragover, setDragover] = useState(false);
  const onUploadedRef = useRef(onUploaded);
  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState(value);
  const [isCleared, setIsCleared] = useState(false);
  const { fileUrl, isUploading, progress, error, upload } = useUploadFile(
    s3Path,
    defaultPresignEndPoint
  );

  useEffect(() => {
    if (fileUrl && progress === 1 && !isUploading) {
      onUploadedRef.current(fileUrl);
    }
  }, [fileUrl, isUploading, progress]);

  const handleFile = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const dataUrl = await readImageFile(file);
      setIsCleared(false);
      setFile(file);
      setImageUrl(dataUrl);
      if (resize) {
        if (!resize.type) {
          resize.type = file.type;
        }
        let image = await loadImageUri(dataUrl);
        image = await resizeImage(image, resize);
        const blob = convertUriToBlob(image.src);
        setFile(new File([blob], file.name, { type: resize.type }));
        setImageUrl(image.src);
      }
    }
  };
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title || 'Upload Image'}</DialogTitle>
      {description && <DialogContent>{description}</DialogContent>}
      <DialogContent>
        <StyledDragArea
          className='drag-area'
          color={dragover ? '#d3d3d3' : 'white'}
          onDragOver={event => {
            event.preventDefault();
            if (disabled) return;
            setDragover(true);
          }}
          onDragLeave={() => !disabled && setDragover(false)}
          onDrop={event => {
            event.preventDefault();
            if (disabled) return;
            setDragover(false);
            handleFile(event.dataTransfer.files);
          }}
        >
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
                <StyledOverlayIconButton
                  size='small'
                  onClick={() => {
                    setFile(undefined);
                    setImageUrl(undefined);
                    setIsCleared(true);
                  }}
                >
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
            onChange={event => handleFile(event.target.files)}
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
        {isCleared ? (
          <Button variant='contained' color='primary' onClick={() => onClear()}>
            Clear Image
          </Button>
        ) : (
          <Button
            variant='contained'
            color='primary'
            disabled={!file || isUploading}
            onClick={() => upload(file as File)}
          >
            Upload
          </Button>
        )}
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

export interface ResizeImageResult {
  warningMessage?: string;
}

export const resizeImage = async (
  image: HTMLImageElement,
  resize: InlineImageResize
) => {
  const result: ResizeImageResult = {};
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Unable to get 2D Canvas context.');
  }
  // let orientation = EXIF.getTag(this, 'Orientation');
  // console.log('EXIF', EXIF.pretty(this))
  let width = resize.width ? resize.width : image.width;
  let height = resize.height ? resize.height : image.height;
  if (!resize.width && resize.maxWidth && image.width > resize.maxWidth) {
    width = resize.maxWidth;
  }
  if (!resize.width && resize.minWidth && image.width < resize.minWidth) {
    width = resize.minWidth;
  }
  if (!resize.height && resize.maxHeight && image.height > resize.maxHeight) {
    height = resize.maxHeight;
  }
  if (!resize.height && resize.minHeight && image.height < resize.minHeight) {
    height = resize.minHeight;
  }
  if (resize.warnSmallImage && (image.width < width || image.height < height)) {
    result.warningMessage =
      'Selected image is smaller then intended size. Image may appear pixelated or blurry.';
  } else if (
    resize.warnAspectRatio &&
    width / image.width !== height / image.height
  ) {
    result.warningMessage = 'Incorrect aspect ratio';
  }

  switch (resize.fit) {
    case InlineImageFit.Cover:
      {
        canvas.width = width;
        canvas.height = height;
        const scale = Math.max(width / image.width, height / image.height);
        width = image.width * scale;
        height = image.height * scale;
      }
      break;
    case InlineImageFit.Contain:
      {
        let scale = Math.min(width / image.width, height / image.height);
        if (scale > 1.0) {
          scale = 1.0;
        } // don't enlarge the image
        width = image.width * scale;
        height = image.height * scale;
        canvas.width = width;
        canvas.height = height;
      }
      break;
    default:
      canvas.width = width;
      canvas.height = height;
      break;
  }
  // context.save();
  // self.setOrientation(canvas, context, width, height, orientation);
  (context as CanvasRenderingContext2D).drawImage(image, 0, 0, width, height);
  // context.restore();
  const imageUri = canvas.toDataURL(
    resize.type || 'image/jpeg',
    resize.quality || 0.8
  );
  return loadImageUri(imageUri);
};

export const convertUriToBlob = (dataURI: string): Blob => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};
