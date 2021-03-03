import * as React from 'react';

import { IUploadFilePickerTabProps, IUploadFilePickerTabState } from '.';
import { IFilePickerResult } from '../FilePicker.types';
import { GeneralHelper } from '../../../common/utilities';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react';

import * as strings from 'M365LPStrings';
import styles from './UploadFilePickerTab.module.scss';



export default class UploadFilePickerTab extends React.Component<IUploadFilePickerTabProps, IUploadFilePickerTabState> {
  constructor(props: IUploadFilePickerTabProps) {
    super(props);
    this.state = {
      filePickerResult: undefined
    };
  }

  public render(): React.ReactElement<IUploadFilePickerTabProps> {
    const { filePickerResult } = this.state;
    const fileName: string = filePickerResult ? filePickerResult.fileName : null;
    const acceptedFilesExtensions = this.props.accepts ? this.props.accepts.join(",") : null;

    return (
      <div className={styles.tabContainer}>
        <div className={styles.tabHeaderContainer}>
          <h2 className={styles.tabHeader}>{strings.UploadFileHeader}</h2>
        </div>
        <div className={styles.tab}>
          <input
            className={styles.localTabInput}
            type="file" id="fileInput"
            accept={acceptedFilesExtensions} multiple={false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this._handleFileUpload(event)}
          />
          {
            fileName &&
            /** Display image preview */
            <div className={styles.localTabSinglePreview}>
              {
                this.state.filePreview &&
                <img className={styles.localTabSinglePreviewImage} src={this.state.filePreview} alt={this.state.filePickerResult.fileName} />
              }
            </div>
          }
          <label className={styles.localTabLabel} htmlFor="fileInput">{
            (fileName ? strings.ChangeFileLinkLabel : strings.ChooseFileLinkLabel)
          }</label>
        </div>
        <div className={styles.actionButtonsContainer}>
          <div className={styles.actionButtons}>
            <PrimaryButton
              disabled={!this.state.filePickerResult}
              onClick={() => this._handleSave()} className={styles.actionButton}>{strings.AddFileButtonLabel}</PrimaryButton>
            <DefaultButton onClick={() => this._handleClose()} className={styles.actionButton}>{strings.CancelButtonLabel}</DefaultButton>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Gets called when a file is uploaded
   */
  private _handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length < 1) {
      return;
    }

    // Get the files that were uploaded
    let files = event.target.files;

    // Grab the first file -- there should always only be one
    const file: File = files[0];

    const filePickerResult: IFilePickerResult = {
      fileAbsoluteUrl: null,
      fileName: file.name,
      fileNameWithoutExtension: GeneralHelper.getFileNameWithoutExtension(file.name),
      downloadFileContent: () => { return Promise.resolve(file); }
    };

    if (GeneralHelper.isImage(file.name)) {
      // Convert to base64 image
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.setState({
          filePreview: reader.result as string
        });
      };
    }
    this.setState({
      filePickerResult
    });
  }

  /**
   * Saves base64 encoded image back to property pane file picker
   */
  private _handleSave = () => {
    this.props.onSave(this.state.filePickerResult);
  }

  /**
   * Closes tab without saving
   */
  private _handleClose = () => {
    this.props.onClose();
  }
}