import { useField, useFormikContext } from 'formik';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  Box,
  Button,
  Grid,
  GridProps,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import {
  api,
  ConfirmDialog,
  defaultPresignEndPoint,
  useUploadFiles
} from '@sierralabs/react-material-ui';

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  .multiple-files-container {
    padding: 0 20px;
    button {
      margin-right: 10px;
    }
  }
`;

const StyledDragArea = styled.div.attrs(props => ({
  color: props.color || 'white'
}))`
  background-color: ${props => props.color};
  position: relative;
  border: solid 1px #ccc;
  border-radius: 4px;
  &:hover {
    .overlay-bar {
      opacity: 1;
    }
  }
  .drag-empty-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .drag-text,
  .drag-button {
    margin: 10px 0;
  }
`;

const StyledTableCell = styled(TableCell)`
  width: 5px;
`;

export interface InlineFileValue {
  url?: string;
  name?: string;
  size?: number;
}

export interface InlineFileProps {
  multiple?: boolean;
  name: string;
  label?: string;
  uploadPath: string;
  inputType?: string;
  grid?: GridProps;
  presignEndPoint?: string;
}

export const InlineFile: React.FC<InlineFileProps> = ({
  multiple,
  label,
  grid,
  uploadPath,
  inputType,
  presignEndPoint = defaultPresignEndPoint,
  ...fieldProps // Note: fieldProps needs to have `name` prop
}) => {
  if (!grid) {
    // default field to expand entire width of form
    grid = { xs: 12 };
  }

  const formik = useFormikContext();
  const [field, meta, { setValue, setTouched }] = useField<InlineFileValue[]>(
    fieldProps
  );
  const fileValues = field.value;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragover, setDragover] = useState(false);
  const [openFileTypeConfirmDialog, setFileTypeConfirmDialog] = useState(false);
  const [attemptedFileName, setAttemptedFileName] = useState('');

  const { uploadFiles, error, upload, remove } = useUploadFiles(
    uploadPath,
    presignEndPoint
  );

  // update progress and submit when completed
  useEffect(() => {
    if (uploadFiles) {
      const value: InlineFileValue[] = uploadFiles.map(uploadFile => ({
        url: uploadFile.presignedResult?.destinationUrl,
        name: uploadFile.file.name,
        size: uploadFile.file.size
      }));
      if (multiple) {
        value.push(
          ...fileValues.filter(
            value =>
              // remove any duplicate files
              !uploadFiles.some(
                uploadFile => value.name === uploadFile.file.name
              )
          )
        );
      }
      setValue(value);
      const completedFiles = uploadFiles.filter(
        uploadFile => uploadFile.isCompleted
      );
      if (
        uploadFiles.length > 0 &&
        completedFiles.length === uploadFiles.length
      ) {
        // submit once all files are uploaded
        formik.submitForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadFiles]);

  // start uploading file(s)
  const handleFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setTouched(true);
    if (!multiple && uploadFiles && uploadFiles.length > 0) {
      // if only one file allowed, remove it before uploading new file
      remove(uploadFiles[0].file);
    }

    const filesToUpload = [];
    // check if file extension is an accepted input type
    for (let i = 0; i < files.length; i++) {
      const fileExtension = files[i].name.match(/\.([^\.]+)$/g);
      const acceptableFileExtension = inputType?.includes(
        fileExtension ? fileExtension[0] : ' '
      );
      if (acceptableFileExtension) {
        // if the file extension is acceptable, push to the filesToUpload array
        filesToUpload.push(files[i]);
      } else {
        // if not acceptable, alert the user
        setAttemptedFileName(files[i].name);
        setFileTypeConfirmDialog(true);
      }
    }
    // if the filesToUpload array has at least one file, proceed to upload
    if (filesToUpload.length > 0) {
      upload(multiple ? filesToUpload : [filesToUpload[0]]);
    }
  };

  const getSecureUrl = (url: string) => {
    return `${url}&token=${api.getAccessToken()}`;
  };

  const formatFileSize = (value: number) => {
    return Math.round((value / 1024) * 100).toLocaleString();
  };

  return (
    <StyledGrid item className='inline-text-field' {...grid}>
      {label && (
        <Typography variant='h5' gutterBottom>
          {label}
        </Typography>
      )}
      <StyledDragArea
        color={dragover ? '#d3d3d3' : 'white'}
        onDragOver={event => {
          event.preventDefault();
          setDragover(true);
        }}
        onDragLeave={() => setDragover(false)}
        onDrop={event => {
          event.preventDefault();
          setDragover(false);
          handleFile(event.dataTransfer.files);
        }}
      >
        {!dragover && fileValues?.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <TableCell>File Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fileValues &&
                  fileValues.length > 0 &&
                  fileValues.map((file, index) => {
                    const uploadFile = uploadFiles?.find(
                      x => x.file.name === file.name
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <IconButton
                            aria-label='delete'
                            onClick={() => {
                              // TODO: use ConfirmDialog
                              if (uploadFile) {
                                remove(uploadFile.file);
                              }
                              setValue(fileValues.filter(f => f !== file));
                              setTouched(true);
                              formik.submitForm();
                            }}
                            size='small'
                          >
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>{file?.name || ''}</TableCell>
                        <TableCell>
                          {formatFileSize(file?.size || 0)} KB
                        </TableCell>
                        <TableCell>
                          {uploadFile?.isUploading && (
                            <LinearProgress
                              color='primary'
                              variant='determinate'
                              value={uploadFile.progress * 100}
                            />
                          )}
                          {file.url && (
                            <a href={getSecureUrl(file.url)} download>
                              Download
                            </a>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            {multiple && (
              <div className='multiple-files-container'>
                <Button
                  className='drag-button'
                  variant='outlined'
                  color='primary'
                  onClick={() => fileInputRef.current?.click()}
                  startIcon={<AddIcon />}
                >
                  Add File
                </Button>
                <Typography variant='overline'>
                  {' '}
                  or drag files into the table above.
                </Typography>
              </div>
            )}
          </TableContainer>
        )}
        {(dragover || fileValues?.length === 0) && (
          <Fragment>
            <div className='drag-empty-container'>
              <Typography variant='subtitle2' className='drag-text'>
                Drag a file here
              </Typography>
              <Typography variant='subtitle2' className='or-text'>
                -- or --
              </Typography>
              <Button
                className='drag-button'
                variant='outlined'
                color='primary'
                onClick={() => fileInputRef.current?.click()}
              >
                Select File
              </Button>
            </div>
          </Fragment>
        )}
        <input
          hidden
          multiple={multiple}
          type='file'
          accept={inputType}
          ref={fileInputRef}
          onChange={event => handleFile(event?.target.files)}
        />
      </StyledDragArea>
      {error && (
        <Box mt={2}>
          <Alert severity='error'>
            Error uploading. Please check the internet connection and try again.
          </Alert>
        </Box>
      )}
      <ConfirmDialog
        open={openFileTypeConfirmDialog}
        title={'Invalid file extension'}
        message={`The file "${attemptedFileName}" is not an accepted file type. Contact administrator.`}
        onCancel={() => {
          setFileTypeConfirmDialog(false);
        }}
        onConfirm={() => {
          setFileTypeConfirmDialog(false);
        }}
      />
    </StyledGrid>
  );
};

export default InlineFile;
